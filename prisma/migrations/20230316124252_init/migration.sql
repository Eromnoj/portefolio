-- CreateTable
CREATE TABLE `Presentation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `presentation` TEXT NOT NULL,

    UNIQUE INDEX `Presentation_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curriculum` (
    `id` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `society` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Web` (
    `id` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToProject` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToProject_AB_unique`(`A`, `B`),
    INDEX `_CategoryToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Presentation` ADD CONSTRAINT `Presentation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToProject` ADD CONSTRAINT `_CategoryToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToProject` ADD CONSTRAINT `_CategoryToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
