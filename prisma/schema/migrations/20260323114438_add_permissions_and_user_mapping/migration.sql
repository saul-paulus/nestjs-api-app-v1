/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "_RolesToUser" DROP CONSTRAINT "_RolesToUser_B_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "tbl_permissions" (
    "permission_id" SERIAL NOT NULL,
    "nm_permission" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "tbl_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PermissionToRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_permissions_nm_permission_key" ON "tbl_permissions"("nm_permission");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_email_key" ON "tbl_users"("email");

-- CreateIndex
CREATE INDEX "_PermissionToRoles_B_index" ON "_PermissionToRoles"("B");

-- AddForeignKey
ALTER TABLE "tbl_users" ADD CONSTRAINT "tbl_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tbl_tenant"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRoles" ADD CONSTRAINT "_PermissionToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRoles" ADD CONSTRAINT "_PermissionToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolesToUser" ADD CONSTRAINT "_RolesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
