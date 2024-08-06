-- CreateEnum
CREATE TYPE "AgendaName" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateTable
CREATE TABLE "meals_agenda" (
    "id" TEXT NOT NULL,
    "meal_id" TEXT NOT NULL,
    "agenda_name" "AgendaName" NOT NULL,
    "time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "target_calorie" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meals_agenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meals_agenda" ADD CONSTRAINT "meals_agenda_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals_agenda" ADD CONSTRAINT "meals_agenda_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
