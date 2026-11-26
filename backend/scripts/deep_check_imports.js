const visited = new Set();
const errors = [];

async function trace(url) {
  if (visited.has(url)) return;
  visited.add(url);

  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      errors.push({ url, status: res.status });
      console.error(`FAILED: ${url} (HTTP ${res.status})`);
      return;
    }
    const text = await res.text();
    if (text.includes('Internal server error') || text.includes('SyntaxError') || text.includes('Failed to resolve')) {
      errors.push({ url, error: text.slice(0, 300) });
      console.error(`SYNTAX/SERVER ERROR in ${url}:\n`, text.slice(0, 300));
      return;
    }

    // find all imports
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
      await trace(nextUrl);
    }
  } catch (err) {
    errors.push({ url, error: err.message });
    console.error(`FETCH ERROR: ${url} - ${err.message}`);
  }
}

async function run() {
  console.log('Recursively checking all frontend module imports from http://localhost:3002/src/main.jsx...');
  await trace('http://localhost:3002/src/main.jsx');
  console.log(`Visited ${visited.size} modules.`);
  console.log(`Errors found: ${errors.length}`);
  if (errors.length) {
    console.log(errors);
  }
}

run();
