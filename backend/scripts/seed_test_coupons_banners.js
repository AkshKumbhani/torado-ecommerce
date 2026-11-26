import { query } from '../src/db.js';

async function seedTestData() {
  console.log('Seeding test Coupons and Banners...');

  // 1. Coupons
  const existingCoupons = await query('SELECT code FROM coupons');
  const existingCodes = existingCoupons.map(c => c.code);

  const testCoupons = [
    {
      code: 'WELCOME20',
      discount_type: 'percentage',
      discount_value: 20.00,
      minimum_order: 499.00,
      maximum_discount: 250.00,
      usage_limit: 100,
      active: 1
    },
    {
      code: 'TORADO100',
      discount_type: 'fixed',
      discount_value: 100.00,
      minimum_order: 799.00,
      maximum_discount: 100.00,
      usage_limit: 50,
      active: 1
    },
    {
      code: 'FESTIVE30',
      discount_type: 'percentage',
      discount_value: 30.00,
      minimum_order: 1299.00,
      maximum_discount: 500.00,
      usage_limit: 200,
      active: 1
    }
  ];

  for (const c of testCoupons) {
    if (!existingCodes.includes(c.code)) {
      await query(
        `INSERT INTO coupons (code, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [c.code, c.discount_type, c.discount_value, c.minimum_order, c.maximum_discount, c.usage_limit, c.active]
      );
      console.log(`Inserted coupon: ${c.code}`);
    }
  }

  // 2. Banners
  const existingBanners = await query('SELECT title FROM banners');
  const existingTitles = existingBanners.map(b => b.title);

  const testBanners = [
    {
      title: 'Winter Streetwear Drop 2026',
      subtitle: 'Up to 40% Off Premium Hoodies, Sweats & Graphic Tees',
      image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
      button_text: 'Shop Collection',
      redirect_url: '/#shop',
      position: 1,
      active: 1
    },
    {
      title: 'Urban Minimalist Essentials',
      subtitle: 'Crafted from 100% Organic Combed Cotton',
      image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
      button_text: 'Explore Men',
      redirect_url: '/#shop-all-for-men',
      position: 2,
      active: 1
    },
    {
      title: 'Festive Luxe Street Style',
      subtitle: 'Limited Edition Holiday Oversized Drops',
      image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      button_text: 'Grab Yours',
      redirect_url: '/#shop-all-for-women',
      position: 3,
      active: 1
    }
  ];

  for (const b of testBanners) {
    if (!existingTitles.includes(b.title)) {
      await query(
        `INSERT INTO banners (title, subtitle, image_url, button_text, redirect_url, position, active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [b.title, b.subtitle, b.image_url, b.button_text, b.redirect_url, b.position, b.active]
      );
      console.log(`Inserted banner: ${b.title}`);
    }
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seedTestData().catch(err => {
  console.error(err);
  process.exit(1);
});
