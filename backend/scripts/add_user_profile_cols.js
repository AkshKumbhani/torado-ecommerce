import { query, pool } from '../src/db.js';

async function run() {
  try {
    const desc = await query('DESCRIBE users');
    const existing = desc.map(d => d.Field);
    
    if (!existing.includes('address')) {
      await query("ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL AFTER phone");
      console.log('Added address column');
    }
    if (!existing.includes('city')) {
      await query("ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL AFTER address");
      console.log('Added city column');
    }
    if (!existing.includes('state')) {
      await query("ALTER TABLE users ADD COLUMN state VARCHAR(100) NULL AFTER city");
      console.log('Added state column');
    }
    if (!existing.includes('country')) {
      await query("ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT 'India' AFTER state");
      console.log('Added country column');
    }
    if (!existing.includes('postal_code')) {
      await query("ALTER TABLE users ADD COLUMN postal_code VARCHAR(20) NULL AFTER country");
      console.log('Added postal_code column');
    }

    // Update customer user (id=2: akshkumbhani9@gmail.com)
    await query(`
      UPDATE users
      SET name = 'Aksh Kumbhani',
          phone = '+91 98765 43210',
          address = '402, Royal Palace, Varachha Main Road',
          city = 'Surat',
          state = 'Gujarat',
          country = 'India',
          postal_code = '395006',
          active = 1
      WHERE email = 'akshkumbhani9@gmail.com'
    `);
    console.log('Updated user akshkumbhani9@gmail.com');

    // Also update Admin user (id=1: akshkumbhani2@gmail.com or set name and details)
    await query(`
      UPDATE users
      SET name = 'Aksh Kumbhani',
          phone = '+91 98765 43210',
          address = '402, Royal Palace, Varachha Main Road',
          city = 'Surat',
          state = 'Gujarat',
          country = 'India',
          postal_code = '395006'
      WHERE id IN (1, 3)
    `);
    console.log('Updated admin users');

    const users = await query('SELECT id, name, email, phone, address, city, state, country, postal_code, role FROM users');
    console.log('Current users:', users);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
