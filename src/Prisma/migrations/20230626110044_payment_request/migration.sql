-- AlterTable
ALTER TABLE `Event` ADD COLUMN `paid` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `PaymentRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `cbe_account` VARCHAR(191) NOT NULL,
    `cbe_fullname` VARCHAR(191) NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `eventId` INTEGER NOT NULL,

    UNIQUE INDEX `PaymentRequest_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentRequest` ADD CONSTRAINT `PaymentRequest_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
