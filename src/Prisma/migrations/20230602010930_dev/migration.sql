/*
  Warnings:

  - Made the column `createdAt` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `passwordreset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `personalaccesstoken` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `personalaccesstoken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `passwordreset` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `personalaccesstoken` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;
