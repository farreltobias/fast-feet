/*
  Warnings:

  - You are about to drop the column `withdrawn_by` on the `deliveries` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_withdrawn_by_fkey";

-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "withdrawn_by",
ADD COLUMN     "deliveryman_id" TEXT,
ADD COLUMN     "posted_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
