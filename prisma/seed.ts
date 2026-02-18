import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Luckin Coffee menu data...');

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.orderTracking.deleteMany();
  await prisma.order.deleteMany();
  await prisma.image.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const signatures = await prisma.category.create({
    data: { name: 'Signatures' },
  });
  const classics = await prisma.category.create({
    data: { name: 'Classics' },
  });
  const coldBrew = await prisma.category.create({
    data: { name: 'Cold Brew' },
  });
  const refreshers = await prisma.category.create({
    data: { name: 'Refreshers' },
  });
  const food = await prisma.category.create({
    data: { name: 'Food' },
  });

  console.log('Categories created');

  // Menu items with realistic Luckin Coffee data
  const menuItems = [
    // Signatures
    {
      name: 'Coconut Latte',
      description: 'Smooth espresso meets creamy coconut milk with a hint of tropical sweetness. Our bestselling signature drink.',
      price: 4.50,
      isSignature: true,
      calories: 180,
      tags: ['popular', 'bestseller'],
      categoryId: signatures.id,
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    },
    {
      name: 'Big Cheesy Latte',
      description: 'Bold espresso topped with our signature velvety cheese foam crown. A unique sweet-savory experience.',
      price: 4.90,
      isSignature: true,
      calories: 220,
      tags: ['popular'],
      categoryId: signatures.id,
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    },
    {
      name: 'Velvet Latte',
      description: 'Silky smooth espresso with our signature velvet cream for a luxurious finish.',
      price: 4.50,
      isSignature: true,
      calories: 190,
      tags: ['new'],
      categoryId: signatures.id,
      imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop',
    },
    {
      name: 'Creamy Dreamy Latte',
      description: 'Rich espresso layered with our house-made creamy foam. Dreams do come true.',
      price: 4.70,
      isSignature: true,
      calories: 200,
      tags: ['popular'],
      categoryId: signatures.id,
      imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop',
    },
    // Classics
    {
      name: 'Americano',
      description: 'Pure espresso with hot water. Simple, bold, and satisfying.',
      price: 2.50,
      isSignature: false,
      calories: 5,
      tags: [],
      categoryId: classics.id,
      imageUrl: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=400&fit=crop',
    },
    {
      name: 'Latte',
      description: 'Perfectly steamed milk meets our signature espresso blend for a classic combination.',
      price: 3.50,
      isSignature: false,
      calories: 150,
      tags: ['popular'],
      categoryId: classics.id,
      imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop',
    },
    {
      name: 'Cappuccino',
      description: 'Equal parts espresso, steamed milk, and velvety foam for the perfect balance.',
      price: 3.50,
      isSignature: false,
      calories: 120,
      tags: [],
      categoryId: classics.id,
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    },
    {
      name: 'Mocha',
      description: 'Rich chocolate meets bold espresso with steamed milk. A timeless indulgence.',
      price: 4.00,
      isSignature: false,
      calories: 250,
      tags: [],
      categoryId: classics.id,
      imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop',
    },
    // Cold Brew
    {
      name: 'Classic Cold Brew',
      description: 'Slow-steeped for 20 hours for an incredibly smooth, naturally sweet flavor.',
      price: 3.50,
      isSignature: false,
      calories: 5,
      tags: [],
      categoryId: coldBrew.id,
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop',
    },
    {
      name: 'Vanilla Cold Brew',
      description: 'Our signature cold brew infused with real Madagascar vanilla.',
      price: 4.00,
      isSignature: false,
      calories: 80,
      tags: ['popular'],
      categoryId: coldBrew.id,
      imageUrl: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=400&h=400&fit=crop',
    },
    {
      name: 'Caramel Cold Brew',
      description: 'Smooth cold brew swirled with buttery caramel for a sweet afternoon pick-me-up.',
      price: 4.00,
      isSignature: false,
      calories: 100,
      tags: [],
      categoryId: coldBrew.id,
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    },
    {
      name: 'Hazelnut Cold Brew',
      description: 'Cold brew paired with toasted hazelnut for a nutty, aromatic experience.',
      price: 4.00,
      isSignature: false,
      calories: 90,
      tags: ['new'],
      categoryId: coldBrew.id,
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
    },
    // Refreshers
    {
      name: 'Ruby Ocean',
      description: 'A vibrant blend of dragonfruit, berry, and sparkling water. Refreshingly bold.',
      price: 4.50,
      isSignature: false,
      calories: 90,
      tags: ['new', 'popular'],
      categoryId: refreshers.id,
      imageUrl: 'https://images.unsplash.com/photo-1560526860-1f0e56046c85?w=400&h=400&fit=crop',
    },
    {
      name: 'Pink Sunrise',
      description: 'Strawberry and guava with a splash of coconut water. Tropical paradise in a cup.',
      price: 4.50,
      isSignature: false,
      calories: 100,
      tags: ['new'],
      categoryId: refreshers.id,
      imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
    },
    {
      name: 'Mango Sunset',
      description: 'Sweet mango blended with passion fruit and a hint of lime. Pure sunshine.',
      price: 4.00,
      isSignature: false,
      calories: 110,
      tags: [],
      categoryId: refreshers.id,
      imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop',
    },
    // Food
    {
      name: 'Turkey & Cheese Sandwich',
      description: 'Sliced turkey with melted cheese, lettuce, and tomato on artisan bread.',
      price: 5.50,
      isSignature: false,
      calories: 380,
      tags: [],
      categoryId: food.id,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop',
    },
    {
      name: 'Chicken Pesto Wrap',
      description: 'Grilled chicken with fresh basil pesto, spinach, and sun-dried tomatoes.',
      price: 5.00,
      isSignature: false,
      calories: 420,
      tags: ['popular'],
      categoryId: food.id,
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    },
    {
      name: 'Almond Croissant',
      description: 'Flaky butter croissant filled with almond cream and topped with sliced almonds.',
      price: 3.50,
      isSignature: false,
      calories: 320,
      tags: [],
      categoryId: food.id,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=400&fit=crop',
    },
    {
      name: 'Blueberry Muffin',
      description: 'Tender muffin bursting with fresh blueberries and a crumbly streusel top.',
      price: 3.00,
      isSignature: false,
      calories: 350,
      tags: [],
      categoryId: food.id,
      imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop',
    },
    {
      name: 'Chocolate Chip Cookie',
      description: 'Warm, gooey chocolate chip cookie baked fresh daily.',
      price: 2.50,
      isSignature: false,
      calories: 280,
      tags: [],
      categoryId: food.id,
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    },
  ];

  for (const item of menuItems) {
    const menu = await prisma.menu.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        isSignature: item.isSignature,
        calories: item.calories,
        tags: item.tags,
        categories: {
          connect: [{ id: item.categoryId }],
        },
        categoryIDs: [item.categoryId],
        images: {
          create: [{ url: item.imageUrl }],
        },
      },
    });
    console.log(`Created: ${menu.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
