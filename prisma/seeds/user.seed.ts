import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient, tenants: any[]) {
  console.log('Seeding users...');
  const superAdminRole = await prisma.roles.findUnique({
    where: { nm_role: 'SUPER_ADMIN' },
  });

  if (tenants.length > 0 && superAdminRole) {
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: 'password123', // In real app, hash this!
        username: 'admin',
        tenant_id: tenants[0].tenant_id,
        roles: {
          connect: [{ role_id: superAdminRole.role_id }],
        },
      },
    });
  }
}
