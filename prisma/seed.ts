import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedTenants } from './seeds/tenant.seed';
import { seedUsers } from './seeds/user.seed';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  try {
    await seedPermissions(prisma);
    await seedRoles(prisma);
    const tenants = await seedTenants(prisma);
    await seedUsers(prisma, tenants);

    console.log('Seeding finished.');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
