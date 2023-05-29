/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_id_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profileId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_profileId_key` ON `User`(`profileId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
