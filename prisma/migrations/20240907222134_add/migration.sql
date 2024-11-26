-- DropIndex
DROP INDEX "Wallet_userId_key";

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "privateKey" TEXT;
