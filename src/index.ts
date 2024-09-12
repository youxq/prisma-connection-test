import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient(); 

async function queryConcurrently(max: number) {
  try {
    const queryPromises = [];
    for (let i = 1; i <= max; i++) {
      queryPromises.push(
        prisma.$queryRaw`SELECT 1`
      );
    }

    await Promise.all(queryPromises);
  } catch(e) {
    console.log('query error', e);
  }
  
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  while (true) {
    await queryConcurrently(17);
    await printConnectionMetrics();
    console.log('Sleeping for 360s...');
    await sleep(360_000);
  }
}

let lastSum = 0;
let lastCount = 0;
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
  metrics.histograms.forEach(v => {
    if (v.key === 'prisma_client_queries_wait_histogram_ms') {
      console.log(`${v.key}: ${(v.value.sum-lastSum) / (v.value.count - lastCount)}`)
      lastSum = v.value.sum
      lastCount = v.value.count
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
