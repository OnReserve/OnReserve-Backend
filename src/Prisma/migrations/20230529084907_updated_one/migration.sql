/*
  Warnings:

  - The primary key for the `personalaccesstoken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `personalaccesstoken` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `personalaccesstoken` table. All the data in the column will be lost.
  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `PersonalAccessToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `PersonalAccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `personalaccesstoken` DROP FOREIGN KEY `PersonalAccessToken_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `booking` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `bookinghistory` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `category` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `categoryevent` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `company` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `companyuser` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `event` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `passwordreset` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `personalaccesstoken` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `profile` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `PersonalAccessToken_userId_key` ON `PersonalAccessToken`(`userId`);

-- AddForeignKey
ALTER TABLE `PersonalAccessToken` ADD CONSTRAINT `PersonalAccessToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_fkey` FOREIGN KEY (`id`) REFERENCES `Profile`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
