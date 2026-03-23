import { PrismaClient } from '@prisma/client';

export async function seedTenants(prisma: PrismaClient) {
  console.log('Seeding tenants...');
  const tenants = [
    {
      code_tenant: 'TENANT001',
      plan_id: 1,
      status: 1,
    },
    {
      code_tenant: 'TENANT002',
      plan_id: 2,
      status: 1,
    },
  ];

  const createdTenants: any[] = [];
  for (const t of tenants) {
    const tenant = await prisma.tenant.upsert({
      where: { code_tenant: t.code_tenant },
      update: {},
      create: t,
    });
    createdTenants.push(tenant);
  }
  return createdTenants;
}
