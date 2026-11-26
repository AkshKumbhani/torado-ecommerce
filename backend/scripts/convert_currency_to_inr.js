import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'frontend/src/admin/AdminPanel.jsx',
  'frontend/src/components/Cart/Cart.jsx',
  'frontend/src/components/CartModal/CartModal.jsx',
  'frontend/src/components/CheckoutInformation/CheckoutInformation.jsx',
  'frontend/src/components/CheckoutPayment/CheckoutPayment.jsx',
  'frontend/src/components/CheckoutShipping/CheckoutShipping.jsx',
  'frontend/src/components/CustomizeSection/CustomizeSection.jsx',
  'frontend/src/components/FAQ/FAQ.jsx',
  'frontend/src/components/FlashSale/FlashSale.jsx',
  'frontend/src/components/FrontBackView/FrontBackView.jsx',
  'frontend/src/components/MensProducts/MensProducts.jsx',
  'frontend/src/components/NewCollection/NewCollection.jsx',
  'frontend/src/components/Overview/Overview.jsx',
  'frontend/src/components/SearchModal/SearchModal.jsx',
  'frontend/src/components/SearchResultPage/SearchResultPage.jsx',
  'frontend/src/components/ShopAllForMen/ShopAllForMen.jsx',
  'frontend/src/components/ShopAllForWomen/ShopAllForWomen.jsx',
  'frontend/src/components/ShopHiddenSidebar/ShopHiddenSidebar.jsx',
  'frontend/src/components/ShopLeftSidebar/ShopLeftSidebar.jsx',
  'frontend/src/components/Wishlist/Wishlist.jsx',
  'frontend/src/components/WishlistModal/WishlistModal.jsx',
  'frontend/src/components/WomensProducts/WomensProducts.jsx'
];

for (const relPath of filesToUpdate) {
  if (!fs.existsSync(relPath)) continue;
  let code = fs.readFileSync(relPath, 'utf8');
  let original = code;

  // AdminPanel
  if (relPath.includes('AdminPanel.jsx')) {
    code = code.replace(/const money = \(n\) => `\$[^{]*\$\{Number\(n \|\| 0\)\.toLocaleString\('en-US'\)\}`;/, "const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;");
    code = code.replace(/return `\$\{Number\(val\)\.toLocaleString\(\)\}`;/g, "return `₹${Number(val).toLocaleString('en-IN')}`;");
    code = code.replace(/return `\$[^{]*\$\{Number\(val\)\.toLocaleString\(\)\}`;/g, "return `₹${Number(val).toLocaleString('en-IN')}`;");
    code = code.replace(/<span>\$\{Math\.round\(/g, "<span>₹${Math.round(");
    code = code.replace(/<span>\$0<\/span>/g, "<span>₹0</span>");
    // Also if money helper has `$`:
    code = code.replace(/`\$(\$\{Number\(n)/g, '`₹$1');
  }

  // Cart
  if (relPath.includes('Cart.jsx')) {
    code = code.replace(/\(\$15\.00\)/g, '(₹15.00)');
    code = code.replace(/\$\{item\.price\.toFixed\(2\)\}/g, '₹{item.price.toFixed(2)}');
    code = code.replace(/\$\{subtotal\.toFixed\(2\)\}/g, '₹{subtotal.toFixed(2)}');
    code = code.replace(/\$\{total\.toFixed\(2\)\}/g, '₹{total.toFixed(2)}');
  }

  // CartModal
  if (relPath.includes('CartModal.jsx')) {
    code = code.replace(/\$\s*\{item\.price\.toFixed\(2\)\}/g, '₹{item.price.toFixed(2)}');
    code = code.replace(/<span className="total">\$\s*\{subtotal\.toFixed\(2\)\}<\/span>/g, '<span className="total">₹{subtotal.toFixed(2)}</span>');
  }

  // Checkout files
  if (relPath.includes('CheckoutInformation.jsx') || relPath.includes('CheckoutShipping.jsx') || relPath.includes('CheckoutPayment.jsx')) {
    code = code.replace(/<span>USD<\/span>\$/g, '<span>INR</span>₹');
    code = code.replace(/<span>USD<\/span>/g, '<span>INR</span>');
    code = code.replace(/\$\$\{subtotal\.toLocaleString\('en-US'/g, '₹${subtotal.toLocaleString(\'en-IN\'');
    code = code.replace(/\$\{subtotal\.toLocaleString\('en-US'/g, '₹{subtotal.toLocaleString(\'en-IN\'');
    code = code.replace(/\$\{subtotal\.toLocaleString\('en-IN'/g, '₹{subtotal.toLocaleString(\'en-IN\'');
    code = code.replace(/-\$\{discountAmount\.toFixed\(2\)\}/g, '-₹{discountAmount.toFixed(2)}');
    code = code.replace(/\$\{Number\(shippingCost\)\.toFixed\(2\)\}/g, '₹{Number(shippingCost).toFixed(2)}');
    code = code.replace(/\$\$\{finalTotal\.toLocaleString\('en-US'/g, '₹${finalTotal.toLocaleString(\'en-IN\'');
    code = code.replace(/\$\{finalTotal\.toLocaleString\('en-US'/g, '₹{finalTotal.toLocaleString(\'en-IN\'');
    code = code.replace(/\$\{finalTotal\.toLocaleString\('en-IN'/g, '₹{finalTotal.toLocaleString(\'en-IN\'');
    code = code.replace(/Cash On Delivery - \$\s*([\d.]+)/g, 'Cash On Delivery - ₹ $1');
    code = code.replace(/Cash On Delivery - \$([\d.]+)/g, 'Cash On Delivery - ₹$1');
  }

  // Product cards and catalog displays
  code = code.replace(/<span>\$<\/span>/g, '<span>₹</span>');
  code = code.replace(/STARTS AT ONLY <b>\$(\d+)<\/b>/g, 'STARTS AT ONLY <b>₹$1</b>');
  code = code.replace(/<span className="price">\$([\d.]+)<\/span>/g, '<span className="price">₹$1</span>');
  code = code.replace(/<div className="price mt-1">\$\s*\{prod\.price\.toFixed\(2\)\}<\/div>/g, '<div className="price mt-1">₹{prod.price.toFixed(2)}</div>');
  code = code.replace(/<div className="price mt-1">\$\{prod\.price\.toFixed\(2\)\}<\/div>/g, '<div className="price mt-1">₹{prod.price.toFixed(2)}</div>');
  code = code.replace(/<span className="product-price">\$\{item\.price\.toFixed\(2\)\}<\/span>/g, '<span className="product-price">₹{item.price.toFixed(2)}</span>');
  code = code.replace(/<span className="result-price">\$\{product\.price\.toFixed\(2\)\}<\/span>/g, '<span className="result-price">₹{product.price.toFixed(2)}</span>');
  code = code.replace(/\$\{product\.price\.toFixed\(2\)\}/g, '₹{product.price.toFixed(2)}');
  code = code.replace(/<div className="price">\$\{prod\.price\.toFixed\(2\)\}<\/div>/g, '<div className="price">₹{prod.price.toFixed(2)}</div>');
  code = code.replace(/<div className="price">\$\{item\.price\.toFixed\(2\)\}<\/div>/g, '<div className="price">₹{item.price.toFixed(2)}</div>');
  code = code.replace(/\$\{item\.price\.toFixed\(2\)\}/g, '₹{item.price.toFixed(2)}');
  code = code.replace(/over \$50\b/g, 'over ₹500');

  if (code !== original) {
    fs.writeFileSync(relPath, code, 'utf8');
    console.log(`Updated ${relPath}`);
    // Sync to src/ mirror
    const mirrorPath = relPath.replace(/^frontend\//, '');
    if (fs.existsSync(mirrorPath)) {
      fs.writeFileSync(mirrorPath, code, 'utf8');
      console.log(`Synced ${mirrorPath}`);
    }
  }
}
console.log('Conversion script finished.');
