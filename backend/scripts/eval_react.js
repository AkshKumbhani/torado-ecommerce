import { spawn } from 'child_process';

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = `C:\\Users\\akshk\\AppData\\Local\\Temp\\chrome-test-${Date.now()}`;
  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profileDir}`,
    'http://localhost:3001/'
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
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: {
                expression: `JSON.stringify({
                  hasReactMain: !!window.ReactMain,
                  hasReactContext: !!window.ReactContext,
                  isSameReact: window.ReactMain === window.ReactContext,
                  secretInternalsMatch: window.ReactMain?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === window.ReactContext?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
                })`
              }
            }));
            setTimeout(resolve, 1000);
          }, 2500);
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === 2) {
            console.log('EVAL RESULT:', msg.result?.result?.value);
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

test();
