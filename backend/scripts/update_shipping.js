import fs from 'fs';

const files = [
  'frontend/src/components/CheckoutPayment/CheckoutPayment.jsx',
  'src/components/CheckoutPayment/CheckoutPayment.jsx'
];

files.forEach(p => {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/useState\('Cash On Delivery - ₹ 18\.50'\)/g, "useState('Standard Delivery - ₹ 49.00')");
    c = c.replace(/useState\(18\.50\)/g, "useState(49.00)");
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated shipping in', p);
  }
});
