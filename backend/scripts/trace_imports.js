async function traceImports() {
  const mainRes = await fetch('http://localhost:3002/src/main.jsx');
  const mainCode = await mainRes.text();
  console.log('mainCode length:', mainCode.length);

  // find all imports in mainCode
  const imports = [...mainCode.matchAll(/from\s+["']([^"']+)["']/g)].map(m => m[1]);
  console.log('Imports in main.jsx:', imports);

  for (const imp of imports) {
    const resolvedUrl = imp.startsWith('.') ? 'http://localhost:3002/src/' + imp.replace(/^\.\//, '') : 'http://localhost:3002' + imp;
    const res = await fetch(resolvedUrl);
    console.log(imp, '-> status:', res.status, 'len:', (await res.text()).length);
  }
}
traceImports();
