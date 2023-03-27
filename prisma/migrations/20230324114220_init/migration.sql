/*
  Warnings:

  - You are about to drop the column `userId` on the `Presentation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Presentation_userId_key` ON `Presentation`;

-- AlterTable
ALTER TABLE `Presentation` DROP COLUMN `userId`;
