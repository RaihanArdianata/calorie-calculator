/*
  Warnings:

  - You are about to drop the column `strArea` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `strMeal` on the `meals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "meals" DROP COLUMN "strArea",
DROP COLUMN "strMeal",
ADD COLUMN     "area" TEXT,
ADD COLUMN     "name" TEXT;
