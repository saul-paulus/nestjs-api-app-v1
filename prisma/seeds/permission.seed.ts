import { PrismaClient } from '@prisma/client';

export async function seedPermissions(prisma: PrismaClient) {
  const permissions = [
    { nm_permission: 'user_create' },
    { nm_permission: 'user_read' },
    { nm_permission: 'user_update' },
    { nm_permission: 'user_delete' },
    { nm_permission: 'tenant_manage' },
  ];

  console.log('Seeding permissions...');
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { nm_permission: p.nm_permission },
      update: {},
      create: p,
    });
  }
}
