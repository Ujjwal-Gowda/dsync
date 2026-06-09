/*
  Warnings:

  - The values [Owner,Admin,Member] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
ALTER TABLE "public"."WorkspaceMembers" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "WorkspaceMembers" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "WorkspaceMembers" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "WorkspaceMembers" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
