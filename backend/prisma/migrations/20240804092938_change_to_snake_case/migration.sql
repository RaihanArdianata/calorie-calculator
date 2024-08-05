/*
  Warnings:

  - You are about to drop the column `externalId` on the `favorite_meals` table. All the data in the column will be lost.
  - You are about to drop the column `mealId` on the `favorite_meals` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `favorite_meals` table. All the data in the column will be lost.
  - You are about to drop the column `carbohydratesTotalG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `cholesterolMg` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fatSaturatedG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fatTotalG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fiberG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `potassiumMg` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `proteinG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `servingSizeG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `sodiumMg` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `sugarG` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `meals` table. All the data in the column will be lost.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `calorieId` on the `tr_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tr_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `mealId` on the `tr_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tr_ingredients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `meals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `favorite_meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_id` to the `favorite_meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `favorite_meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbohydrates_total_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cholesterol_mg` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat_saturated_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat_total_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiber_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potassium_mg` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serving_size_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sodium_mg` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sugar_g` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calorie_id` to the `tr_ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_id` to the `tr_ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tr_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "favorite_meals" DROP CONSTRAINT "favorite_meals_mealId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_meals" DROP CONSTRAINT "favorite_meals_userId_fkey";

-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_userId_fkey";

-- DropForeignKey
ALTER TABLE "tr_ingredients" DROP CONSTRAINT "tr_ingredients_calorieId_fkey";

-- DropForeignKey
ALTER TABLE "tr_ingredients" DROP CONSTRAINT "tr_ingredients_mealId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropIndex
DROP INDEX "meals_externalId_key";

-- AlterTable
ALTER TABLE "favorite_meals" DROP COLUMN "externalId",
DROP COLUMN "mealId",
DROP COLUMN "userId",
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "meal_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "carbohydratesTotalG",
DROP COLUMN "cholesterolMg",
DROP COLUMN "createdAt",
DROP COLUMN "fatSaturatedG",
DROP COLUMN "fatTotalG",
DROP COLUMN "fiberG",
DROP COLUMN "potassiumMg",
DROP COLUMN "proteinG",
DROP COLUMN "servingSizeG",
DROP COLUMN "sodiumMg",
DROP COLUMN "sugarG",
DROP COLUMN "updatedAt",
ADD COLUMN     "carbohydrates_total_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cholesterol_mg" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fat_saturated_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fat_total_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fiber_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "potassium_mg" INTEGER NOT NULL,
ADD COLUMN     "protein_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "serving_size_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sodium_mg" INTEGER NOT NULL,
ADD COLUMN     "sugar_g" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "createdAt",
DROP COLUMN "externalId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "token" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "token" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tr_ingredients" DROP COLUMN "calorieId",
DROP COLUMN "createdAt",
DROP COLUMN "mealId",
DROP COLUMN "updatedAt",
ADD COLUMN     "calorie_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "meal_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "meals_external_id_key" ON "meals"("external_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_meals" ADD CONSTRAINT "favorite_meals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_meals" ADD CONSTRAINT "favorite_meals_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tr_ingredients" ADD CONSTRAINT "tr_ingredients_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tr_ingredients" ADD CONSTRAINT "tr_ingredients_calorie_id_fkey" FOREIGN KEY ("calorie_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
