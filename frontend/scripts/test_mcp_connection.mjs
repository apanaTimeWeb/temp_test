import { spawn } from 'child_process';

const mcp = spawn('cmd.exe', ['/c', 'npx', '-y', 'chrome-devtools-mcp@latest', '--headless'], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let buffer = '';

mcp.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop();

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      console.log('Received from MCP:', msg.id, msg.result ? 'result' : (msg.error || 'notification'));
      if (msg.id === 1) {
        console.log('MCP Initialized! Capabilities:', JSON.stringify(msg.result.capabilities));
        // Send initialized notification
        mcp.stdin.write(JSON.stringify({
          jsonrpc: '2.0',
          method: 'notifications/initialized',
        }) + '\n');

        // Request tools list
        mcp.stdin.write(JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        }) + '\n');
      } else if (msg.id === 2) {
        console.log('Available MCP Tools:', msg.result.tools.map(t => t.name).join(', '));
        mcp.kill();
        process.exit(0);
      }
    } catch (e) {
      console.log('Non-JSON stdout line:', line);
    }
  }
});

// Send initialize request
const initReq = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0',
    },
  },
};

mcp.stdin.write(JSON.stringify(initReq) + '\n');

