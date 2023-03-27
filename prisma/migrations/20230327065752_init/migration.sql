/*
  Warnings:

  - Added the required column `alt` to the `Web` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Web` ADD COLUMN `alt` VARCHAR(191) NOT NULL;
