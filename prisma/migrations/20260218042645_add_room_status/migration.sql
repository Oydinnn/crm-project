-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'active';
