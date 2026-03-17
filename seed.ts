import { prisma } from './lib/prisma';
import { PRODUCTS } from './constants/products';

async function main() {
  console.log('Seeding products...');

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
      },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
