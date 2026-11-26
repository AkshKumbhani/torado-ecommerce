const visited = new Set();

async function trace(url, fromUrl = 'ROOT') {
  if (visited.has(url)) return;
  visited.add(url);

  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      console.error(`FAILED: ${url} (HTTP ${res.status}) imported from ${fromUrl}`);
      return;
    }
    const text = await res.text();
    if (text.includes('MyComponent')) {
      console.log(`URL ${url} contains MyComponent!`);
      const lines = text.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('MyComponent')) console.log(`  L${i+1}: ${l.trim().slice(0, 150)}`);
      });
    }

    const matches = [...text.matchAll(/from\s+["']([^"']+)["']/g), ...text.matchAll(/import\s*\(?["']([^"']+)["']\)?/g)];
    for (const m of matches) {
      let target = m[1];
      if (target.startsWith('http') && !target.includes('localhost:3002')) continue;
      
      let nextUrl;
      if (target.startsWith('/')) {
        nextUrl = 'http://localhost:3002' + target;
      } else if (target.startsWith('.')) {
        const u = new URL(target, url);
        nextUrl = u.href;
      } else {
        continue;
      }
      await trace(nextUrl, url);
    }
  } catch (err) {
    console.error(`FETCH ERROR: ${url} - ${err.message}`);
  }
}

trace('http://localhost:3002/src/main.jsx');
