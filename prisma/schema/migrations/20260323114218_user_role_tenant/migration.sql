/*
  Warnings:

  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- DropTable
DROP TABLE "Tenant";

-- CreateTable
CREATE TABLE "tbl_roles" (
    "role_id" SERIAL NOT NULL,
    "nm_role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "tbl_tenant" (
    "tenant_id" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "code_tenant" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_tenant_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "_RolesToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RolesToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_roles_nm_role_key" ON "tbl_roles"("nm_role");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_tenant_code_tenant_key" ON "tbl_tenant"("code_tenant");

-- CreateIndex
CREATE INDEX "_RolesToUser_B_index" ON "_RolesToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tbl_tenant"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolesToUser" ADD CONSTRAINT "_RolesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolesToUser" ADD CONSTRAINT "_RolesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
