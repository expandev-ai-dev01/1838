-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_repositoryname]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
--
-- NAMING CONVENTION (CRITICAL):
-- Use camelCase for ALL column names to align with JavaScript/TypeScript frontend
-- CORRECT: [userId], [createdAt], [firstName]
-- WRONG: [user_id], [created_at], [first_name]
-- Exception: [id] is always lowercase
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

CREATE TABLE [dbo].[purchase] (
    [id] INT IDENTITY(1,1) NOT NULL,
    [purchaseUid] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [idAccount] INT NOT NULL,
    [productName] NVARCHAR(100) NOT NULL,
    [quantity] DECIMAL(10,3) NOT NULL,
    [measurementUnit] NVARCHAR(20) NOT NULL,
    [unitPrice] DECIMAL(10,2) NOT NULL,
    [totalPrice] DECIMAL(10,2) NOT NULL,
    [purchaseDate] DATE NOT NULL,
    [category] NVARCHAR(50) NULL,
    [purchaseLocation] NVARCHAR(100) NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [pkPurchase] PRIMARY KEY CLUSTERED ([id]);
GO

ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [uqPurchase_Uid] UNIQUE NONCLUSTERED ([purchaseUid]);
GO

CREATE NONCLUSTERED INDEX [ixPurchase_Account]
ON [dbo].[purchase]([idAccount])
INCLUDE ([purchaseDate], [totalPrice]);
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseCreate]
    @idAccount INT,
    @productName NVARCHAR(100),
    @quantity DECIMAL(10,3),
    @measurementUnit NVARCHAR(20),
    @unitPrice DECIMAL(10,2),
    @purchaseDate DATE,
    @category NVARCHAR(50) = NULL,
    @purchaseLocation NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @totalPrice DECIMAL(10,2) = @quantity * @unitPrice;
    DECLARE @newId TABLE (id INT, purchaseUid UNIQUEIDENTIFIER);

    INSERT INTO [dbo].[purchase] (
        [idAccount], [productName], [quantity], [measurementUnit], 
        [unitPrice], [totalPrice], [purchaseDate], [category], [purchaseLocation]
    )
    OUTPUT INSERTED.id, INSERTED.purchaseUid INTO @newId
    VALUES (
        @idAccount, @productName, @quantity, @measurementUnit, 
        @unitPrice, @totalPrice, @purchaseDate, @category, @purchaseLocation
    );

    SELECT 
        p.* 
    FROM [dbo].[purchase] p
    INNER JOIN @newId n ON p.id = n.id;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseUpdate]
    @idAccount INT,
    @purchaseUid UNIQUEIDENTIFIER,
    @productName NVARCHAR(100),
    @quantity DECIMAL(10,3),
    @measurementUnit NVARCHAR(20),
    @unitPrice DECIMAL(10,2),
    @purchaseDate DATE,
    @category NVARCHAR(50) = NULL,
    @purchaseLocation NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[purchase] WHERE purchaseUid = @purchaseUid AND idAccount = @idAccount)
    BEGIN
        ;THROW 51000, 'PurchaseNotFound', 1;
    END

    DECLARE @totalPrice DECIMAL(10,2) = @quantity * @unitPrice;

    UPDATE [dbo].[purchase]
    SET 
        [productName] = @productName,
        [quantity] = @quantity,
        [measurementUnit] = @measurementUnit,
        [unitPrice] = @unitPrice,
        [totalPrice] = @totalPrice,
        [purchaseDate] = @purchaseDate,
        [category] = @category,
        [purchaseLocation] = @purchaseLocation
    WHERE purchaseUid = @purchaseUid AND idAccount = @idAccount;

    SELECT * FROM [dbo].[purchase] WHERE purchaseUid = @purchaseUid;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseDelete]
    @idAccount INT,
    @purchaseUid UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[purchase] WHERE purchaseUid = @purchaseUid AND idAccount = @idAccount)
    BEGIN
        ;THROW 51000, 'PurchaseNotFound', 1;
    END

    DELETE FROM [dbo].[purchase]
    WHERE purchaseUid = @purchaseUid AND idAccount = @idAccount;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseList]
    @idAccount INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Result Set 1: List
    SELECT * 
    FROM [dbo].[purchase] 
    WHERE idAccount = @idAccount 
    ORDER BY purchaseDate DESC;

    -- Result Set 2: Month Total
    SELECT ISNULL(SUM(totalPrice), 0) as totalCurrentMonth
    FROM [dbo].[purchase]
    WHERE idAccount = @idAccount
      AND MONTH(purchaseDate) = MONTH(GETDATE())
      AND YEAR(purchaseDate) = YEAR(GETDATE());
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseGet]
    @idAccount INT,
    @purchaseUid UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * 
    FROM [dbo].[purchase] 
    WHERE purchaseUid = @purchaseUid AND idAccount = @idAccount;
END;
GO