import fs from 'fs';
import path from 'path';

function findLines(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') findLines(full);
    } else if (f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('$') || l.includes('USD')) {
          const isCurrency = /(>\s*\$|\$\s*\d|`[^`]*\$\$|'\$'|"\$"|\bUSD\b|\$\s*\{item|\$\s*\{product|\$\s*\{price|\$\s*\{total|\$\s*\{subtotal|\$\s*\{amount|\$\s*\{Number|\$\s*\{val|\$\s*\{ship|\$\s*\{disc)/i.test(l);
          if (isCurrency) {
            console.log(`${full.replace(/\\/g, '/')}:${i + 1}: ${l.trim()}`);
          }
        }
      });
    }
  }
}

findLines('frontend/src');
