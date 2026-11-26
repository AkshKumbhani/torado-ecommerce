import fs from 'fs';

const files = [
  'frontend/src/components/CustomizeSection/CustomizeSection.jsx',
  'frontend/src/components/FlashSale/FlashSale.jsx',
  'frontend/src/components/MensProducts/MensProducts.jsx',
  'frontend/src/components/NewCollection/NewCollection.jsx',
  'frontend/src/components/SearchModal/SearchModal.jsx',
  'frontend/src/components/SearchResultPage/SearchResultPage.jsx',
  'frontend/src/components/ShopAllForMen/ShopAllForMen.jsx',
  'frontend/src/components/ShopAllForWomen/ShopAllForWomen.jsx',
  'frontend/src/components/ShopHiddenSidebar/ShopHiddenSidebar.jsx',
  'frontend/src/components/ShopLeftSidebar/ShopLeftSidebar.jsx',
  'frontend/src/components/Wishlist/Wishlist.jsx',
  'frontend/src/components/WomensProducts/WomensProducts.jsx',
  'frontend/src/context/ShopContext.jsx'
];

const RATE = 86;

files.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  const original = code;

  // Convert price: 7.50, oldPrice: 15.00, originalPrice: 12.00
  code = code.replace(/\b(price|oldPrice|originalPrice|startingPrice|unitPrice)\s*:\s*([0-9]+(?:\.[0-9]+)?)\b/g, (match, key, val) => {
    const num = parseFloat(val);
    if (num > 0 && num < 200) {
      const converted = Math.round(num * RATE);
      return `${key}: ${converted}`;
    }
    return match;
  });

  // Also STARTS AT ONLY <b>₹10</b> -> <b>₹860</b>
  code = code.replace(/STARTS AT ONLY <b>₹(\d+)<\/b>/g, (m, val) => {
    const num = parseInt(val, 10);
    if (num < 100) return `STARTS AT ONLY <b>₹${num * RATE}</b>`;
    return m;
  });

  if (code !== original) {
    fs.writeFileSync(p, code, 'utf8');
    console.log('Converted prices in:', p);
    const mirror = p.replace(/^frontend\//, '');
    if (fs.existsSync(mirror)) {
      fs.writeFileSync(mirror, code, 'utf8');
      console.log('Synced mirror:', mirror);
    }
  }
});

console.log('All frontend static prices successfully converted from USD to INR!');
