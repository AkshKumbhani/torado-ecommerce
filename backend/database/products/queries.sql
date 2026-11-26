-- Catalogue queries used by the storefront and admin API.
SELECT id,name,description,category,price,original_price,stock,sizes,colors,image_url,featured
FROM products WHERE status='active' ORDER BY featured DESC, created_at DESC;

SELECT id,name,category,sku,stock,status FROM products
WHERE stock <= ? ORDER BY stock ASC, name ASC;

SELECT id,name,description,category,price,original_price,stock,sku,sizes,colors,status,featured,image_url
FROM products WHERE id = ? LIMIT 1;

-- Safe product stock update. Pass the signed delta from a validated order or admin action.
UPDATE products SET stock = GREATEST(0, stock + ?) WHERE id = ?;

-- Categories with product counts, for safe category deletion checks.
SELECT c.id,c.name,c.status,COUNT(p.id) AS product_count
FROM categories c LEFT JOIN products p ON p.category=c.name
GROUP BY c.id,c.name,c.status ORDER BY c.name;
