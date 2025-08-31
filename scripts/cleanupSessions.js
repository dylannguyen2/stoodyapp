import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanupOldSessions() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  await prisma.guestSession.deleteMany({
    where: {
      lastActiveAt: { lt: fiveMinutesAgo }
    }
  });
  console.log('Old sessions cleaned up');
  await prisma.$disconnect();
}

cleanupOldSessions();