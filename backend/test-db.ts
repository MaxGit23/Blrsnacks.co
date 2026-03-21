import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const res = await prisma.$queryRawUnsafe('DESCRIBE Product');
  console.log(res);
}
main().catch(console.error).finally(() => prisma.$disconnect());
