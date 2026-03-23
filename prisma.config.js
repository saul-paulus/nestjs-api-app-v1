import 'dotenv/config'

export default {
  schema: './prisma/schema',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },
}
