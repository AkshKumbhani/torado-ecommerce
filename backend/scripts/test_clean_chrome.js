import { spawn } from 'child_process';

async function testPage(targetUrl) {
  console.log(`Testing ${targetUrl} via Chrome DevTools Protocol (Clean Profile)...`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = `C:\\Users\\akshk\\AppData\\Local\\Temp\\chrome-test-${Date.now()}`;
  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profileDir}`,
    targetUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9222/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('localhost'));
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);
      
      await new Promise((resolve) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Network.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Network.setCacheDisabled', params: { cacheDisabled: true } }));
          ws.send(JSON.stringify({ id: 3, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 4, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 5, method: 'Page.enable' }));
          ws.send(JSON.stringify({ id: 6, method: 'Page.reload', params: { ignoreCache: true } }));
          
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 7,
              method: 'Runtime.evaluate',
              params: {
                expression: 'document.getElementById("root")?.innerHTML?.length || 0'
              }
            }));
            setTimeout(resolve, 1000);
          }, 3500);
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('[BROWSER CONSOLE]', msg.params.type, ...msg.params.args.map(a => a.value || a.description));
          } else if (msg.method === 'Runtime.exceptionThrown') {
            console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
          } else if (msg.id === 7) {
            console.log('>>> Root DOM innerHTML length:', msg.result?.result?.value);
          }
        };
      });
      ws.close();
    }
  } catch (err) {
    console.error('Debug error:', err.message);
  } finally {
    proc.kill();
  }
}

testPage(process.argv[2] || 'http://localhost:3001/');
