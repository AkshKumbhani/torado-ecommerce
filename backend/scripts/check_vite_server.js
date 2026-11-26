async function main() {
  for (const port of [3001, 3002]) {
    try {
      const res = await fetch(`http://localhost:${port}/`);
      const html = await res.text();
      console.log(`Port ${port} status:`, res.status, 'HTML length:', html.length);
      
      const scriptTags = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
      for (const src of scriptTags) {
        if (src.startsWith('http')) continue;
        const sRes = await fetch(`http://localhost:${port}${src}`);
        const sText = await sRes.text();
        console.log(`  -> ${src} status: ${sRes.status}, length: ${sText.length}`);
        if (sRes.status !== 200 || sText.includes('Internal server error') || sText.includes('Failed to resolve import') || sText.includes('SyntaxError')) {
          console.log(`  -> ERROR in ${src}:`, sText.slice(0, 500));
        }
      }
    } catch (err) {
      console.log(`Port ${port} error:`, err.message);
    }
  }
}
main();
