import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUsersConcurrently() {
  const createPromises = [];

  for (let i = 1; i <= 11; i++) {
    createPromises.push(
      prisma.user.create({
        data: { name: `User${i}` },
      })
    );
  }

  const newUsers = await Promise.all(createPromises);
  console.log('Created new users total: ', newUsers.length);
}

async function queryUsersConcurrently() {
  const queryPromises = [];

  for (let i = 1; i <= 11; i++) {
    queryPromises.push(
      prisma.user.findMany({
        where: { name: `User${i}` },
      })
    );
  }

  const allUsers = await Promise.all(queryPromises);
  console.log('Queried users total: ', allUsers.length);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await createUsersConcurrently();
  await printConnectionMetrics();

  while (true) {
    console.log('Sleeping for 5 minutes...');
    await sleep(300000);

    await queryUsersConcurrently();
    await printConnectionMetrics();
  }
}

async function printConnectionMetrics() {
  const metrics = await prisma.$metrics.json()
  metrics.counters.forEach(v => {
    if (v.key === 'prisma_pool_connections_closed_total' || v.key === 'prisma_pool_connections_opened_total') {
      console.log(`${v.key}: ${v.value}`)
    }
  })
  metrics.gauges.forEach(v => {
    if (v.key === 'prisma_pool_connections_open' || v.key === 'prisma_pool_connections_idle') {
      console.log(`${v.key}: ${v.value}`)
    }
  })
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });