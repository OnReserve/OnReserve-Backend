/*
  Warnings:

  - You are about to drop the column `profileId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_profileId_key` ON `user`;

-- AlterTable
ALTER TABLE `profile` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `profileId`;
