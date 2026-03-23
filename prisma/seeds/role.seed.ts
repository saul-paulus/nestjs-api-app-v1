import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  console.log('Seeding roles...');
  const allPermissions = await prisma.permission.findMany();

  const roles = [
    {
      nm_role: 'SUPER_ADMIN',
      permissions: {
        connect: allPermissions.map((p) => ({
          permission_id: p.permission_id,
        })),
      },
    },
    {
      nm_role: 'ADMIN',
      permissions: {
        connect: allPermissions
          .filter((p) => p.nm_permission.startsWith('user_'))
          .map((p) => ({ permission_id: p.permission_id })),
      },
    },
    {
      nm_role: 'USER',
      permissions: {
        connect: allPermissions
          .filter((p) => p.nm_permission === 'user_read')
          .map((p) => ({ permission_id: p.permission_id })),
      },
    },
  ];

  for (const r of roles) {
    await prisma.roles.upsert({
      where: { nm_role: r.nm_role },
      update: {
        permissions: r.permissions,
      },
      create: r,
    });
  }
}
