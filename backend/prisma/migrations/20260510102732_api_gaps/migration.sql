-- AlterEnum
ALTER TYPE "PackingCategory" ADD VALUE 'WELLNESS';

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "destination" TEXT;

-- AlterTable
ALTER TABLE "TripNote" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "tripStopId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'public';

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_key" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- AddForeignKey
ALTER TABLE "TripNote" ADD CONSTRAINT "TripNote_tripStopId_fkey" FOREIGN KEY ("tripStopId") REFERENCES "TripStop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
