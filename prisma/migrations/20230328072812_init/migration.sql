/*
  Warnings:

  - The required column `cloudinaryImgId` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `cloudinaryImgId` was added to the `Project` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `cloudinaryImgId` was added to the `Web` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `cloudinaryImgId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `cloudinaryImgId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Web` ADD COLUMN `cloudinaryImgId` VARCHAR(191) NOT NULL;
