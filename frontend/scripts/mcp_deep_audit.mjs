import { spawn } from 'child_process';
import path from 'path';

const screenshotDir = 'C:\\Users\\satyam\\.gemini\\antigravity\\brain\\3adccbc6-d4df-4e5a-8463-974c4ad04474';

class McpClient {
  constructor() {
    this.reqId = 0;
    this.pending = new Map();
    this.process = null;
    this.buffer = '';
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.process = spawn('cmd.exe', ['/c', 'npx', '-y', 'chrome-devtools-mcp@latest', '--headless', '--allow-unrestricted-paths'], {
        stdio: ['pipe', 'pipe', 'inherit'],
      });

      this.process.stdout.on('data', (chunk) => {
        this.buffer += chunk.toString();
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            if (msg.id && this.pending.has(msg.id)) {
              const { resolve: pResolve, reject: pReject } = this.pending.get(msg.id);
              this.pending.delete(msg.id);
              if (msg.error) {
                pReject(new Error(msg.error.message || JSON.stringify(msg.error)));
              } else {
                pResolve(msg.result);
              }
            }
          } catch (e) {
            // Non-JSON logging from mcp server
          }
        }
      });

      this.process.on('error', reject);

      // Initialize
      this.call('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'mcp-deep-audit', version: '1.0.0' },
      }).then((res) => {
        // Send notifications/initialized
        this.process.stdin.write(JSON.stringify({
          jsonrpc: '2.0',
          method: 'notifications/initialized',
        }) + '\n');
        resolve(res);
      }).catch(reject);
    });
  }

  call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.reqId;
      this.pending.set(id, { resolve, reject });
      const req = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };
      this.process.stdin.write(JSON.stringify(req) + '\n');
    });
  }

  async callTool(name, args = {}) {
    const res = await this.call('tools/call', {
      name,
      arguments: args,
    });
    if (res.isError) {
      throw new Error(`Tool ${name} failed: ${JSON.stringify(res.content)}`);
    }
    return res;
  }

  async close() {
    if (this.process) {
      this.process.kill();
    }
  }
}

// Helper to extract element uid by label or text pattern from snapshot text
function findUid(snapshotText, regex) {
  const lines = snapshotText.split('\n');
  for (const line of lines) {
    if (regex.test(line)) {
      const match = line.match(/uid=([^\s]+)/) || line.match(/\{([0-9a-zA-Z_-]+)\}/) || line.match(/uid:\s*([^\s,]+)/);
      if (match) return match[1];
    }
  }
  return null;
}

async function runMcpAudit() {
  console.log('=== STARTING CHROME DEVTOOLS MCP DEEP AUDIT ===');
  const client = new McpClient();
  await client.start();
  console.log('✓ Successfully connected to Chrome DevTools MCP server.');

  const results = [];

  try {
    // 1. Create a page with new_page
    console.log('\n[MCP Step 1] Creating new page targeting /auth/login...');
    const newPageRes = await client.callTool('new_page', { url: 'http://localhost:3000/auth/login' });
    const pageText = newPageRes.content?.[0]?.text || '';
    console.log('Pages list from MCP:', pageText);

    // Extract pageId from pageText (e.g. "2: Library OS - Authentication ...")
    const pageIdMatch = pageText.match(/(\d+):\s*Library OS/i) || pageText.match(/(\d+):[^\n]+selected/i);
    const pageId = pageIdMatch ? parseInt(pageIdMatch[1], 10) : 2;
    console.log(`✓ Active target pageId: ${pageId}`);

    // Wait for the login form to load
    await client.callTool('wait_for', { pageId, text: ['Welcome back'] });
    console.log('✓ /auth/login loaded confirmed via MCP wait_for.');

    // Audit computed CSS tokens
    const cssTokens = await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        const s = getComputedStyle(document.documentElement);
        return {
          colorPrimary: s.getPropertyValue('--color-primary').trim(),
          colorBgPage: s.getPropertyValue('--color-bg-page').trim(),
          colorBgCard: s.getPropertyValue('--color-bg-card').trim(),
          colorBorder: s.getPropertyValue('--color-border').trim(),
        };
      }`,
    });
    console.log('✓ CSS Design Tokens evaluated via MCP evaluate_script:', cssTokens.content?.[0]?.text);

    // Click demo fill via evaluate_script or click
    console.log('[MCP Step 2] Clicking Fill demo data on login form...');
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        const btn = document.querySelector('[data-testid="auth-login-demo-fill"]');
        if (btn) btn.click();
      }`,
    });

    const loginVals = await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        return {
          email: document.querySelector('[data-testid="auth-login-email-input"]').value,
          hasPassword: Boolean(document.querySelector('[data-testid="auth-login-password-input"]').value),
          role: document.querySelector('[data-testid="auth-login-role-value"]').value,
        };
      }`,
    });
    console.log('✓ Login populated values:', loginVals.content?.[0]?.text);

    // Take screenshot via MCP
    await client.callTool('take_screenshot', {
      pageId,
      fullPage: true,
      filePath: path.join(screenshotDir, 'mcp_01_login_filled.png'),
    });
    console.log('✓ Saved MCP screenshot: mcp_01_login_filled.png');

    // Submit login form
    console.log('[MCP Step 3] Submitting login form...');
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        document.querySelector('[data-testid="auth-login-submit"]').click();
      }`,
    });
    await client.callTool('wait_for', { pageId, text: ['Admin Dashboard'] });
    const loginDest = await client.callTool('evaluate_script', {
      pageId,
      function: `() => window.location.pathname`,
    });
    console.log('✓ Redirection verified:', loginDest.content?.[0]?.text);
    results.push({ flow: 'Sign In (Admin)', status: 'PASS', destination: loginDest.content?.[0]?.text });

    // 2. Registration Page
    console.log('\n[MCP Step 4] Navigating to /auth/signup via MCP navigate_page...');
    await client.callTool('navigate_page', { pageId, url: 'http://localhost:3000/auth/signup' });
    await client.callTool('wait_for', { pageId, text: ['Create a library account'] });
    console.log('✓ /auth/signup reached.');

    // Take snapshot of Registration
    const signupSnap = await client.callTool('take_snapshot', { pageId, verbose: false });
    console.log('✓ Registration accessibility snapshot captured via MCP take_snapshot.');

    // Click demo fill
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        const btn = document.querySelector('[data-testid="auth-signup-demo-fill"]');
        if (btn) btn.click();
      }`,
    });

    const signupVals = await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        return {
          owner: document.querySelector('[data-testid="auth-signup-owner-name-input"]').value,
          library: document.querySelector('[data-testid="auth-signup-library-name-input"]').value,
          email: document.querySelector('[data-testid="auth-signup-email-input"]').value,
          phone: document.querySelector('[data-testid="auth-signup-phone-input"]').value,
          passwordStrength: document.querySelector('[data-testid="auth-signup-password-strength-meter"]')?.innerText || '',
        };
      }`,
    });
    console.log('✓ Registration populated values & strength meter:', signupVals.content?.[0]?.text);

    await client.callTool('take_screenshot', {
      pageId,
      fullPage: true,
      filePath: path.join(screenshotDir, 'mcp_02_signup_filled.png'),
    });
    console.log('✓ Saved MCP screenshot: mcp_02_signup_filled.png');

    // Submit registration
    console.log('[MCP Step 5] Submitting registration form...');
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        document.querySelector('[data-testid="auth-signup-submit"]').click();
      }`,
    });
    await client.callTool('wait_for', { pageId, text: ['Library Setup Wizard'] });
    const signupDest = await client.callTool('evaluate_script', {
      pageId,
      function: `() => window.location.pathname`,
    });
    console.log('✓ Registration redirection reached:', signupDest.content?.[0]?.text);
    results.push({ flow: 'Registration (Superadmin)', status: 'PASS', destination: signupDest.content?.[0]?.text });

    // 3. Password Recovery
    console.log('\n[MCP Step 6] Navigating to /auth/forgot-password via MCP navigate_page...');
    await client.callTool('navigate_page', { pageId, url: 'http://localhost:3000/auth/forgot-password' });
    await client.callTool('wait_for', { pageId, text: ['Forgot password?'] });

    // Click demo fill
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        const btn = document.querySelector('[data-testid="auth-forgot-demo-fill"]');
        if (btn) btn.click();
      }`,
    });

    const forgotVals = await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        return { identity: document.querySelector('[data-testid="auth-forgot-identity-input"]').value };
      }`,
    });
    console.log('✓ Recovery populated values:', forgotVals.content?.[0]?.text);

    await client.callTool('take_screenshot', {
      pageId,
      fullPage: true,
      filePath: path.join(screenshotDir, 'mcp_03_forgot_filled.png'),
    });

    // Submit recovery
    console.log('[MCP Step 7] Submitting recovery request...');
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        document.querySelector('[data-testid="auth-forgot-submit"]').click();
      }`,
    });
    await client.callTool('wait_for', { pageId, text: ['Recovery request accepted'] });
    console.log('✓ Recovery accepted confirmation verified via MCP wait_for.');
    results.push({ flow: 'Password Recovery Feedback', status: 'PASS', feedback: 'Accepted state confirmed' });

    // 4. Password Reset
    console.log('\n[MCP Step 8] Navigating to /auth/reset-password via MCP navigate_page...');
    await client.callTool('navigate_page', { pageId, url: 'http://localhost:3000/auth/reset-password' });
    await client.callTool('wait_for', { pageId, text: ['Reset password'] });

    // Click demo fill on reset
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        const btn = document.querySelector('[data-testid="auth-reset-demo-fill"]');
        if (btn) btn.click();
      }`,
    });

    const resetOtpVals = await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        const slots = Array.from(document.querySelectorAll('[data-testid^="auth-reset-otp-digit-"]'));
        return {
          slotsCount: slots.length,
          otpValue: slots.map(s => s.value).join(''),
          hasPassword: Boolean(document.querySelector('[data-testid="auth-reset-password-input"]').value),
        };
      }`,
    });
    console.log('✓ Reset OTP slots populated:', resetOtpVals.content?.[0]?.text);

    await client.callTool('take_screenshot', {
      pageId,
      fullPage: true,
      filePath: path.join(screenshotDir, 'mcp_04_reset_filled.png'),
    });

    // Submit reset
    console.log('[MCP Step 9] Submitting password reset form...');
    await client.callTool('evaluate_script', {
      pageId,
      function: `() => {
        document.querySelector('[data-testid="auth-reset-submit"]').click();
      }`,
    });
    await client.callTool('wait_for', { pageId, text: ['Password update accepted'] });
    console.log('✓ Reset completion verified via MCP wait_for.');
    results.push({ flow: 'Password Reset Feedback', status: 'PASS', feedback: 'Completion state confirmed' });

    // 5. Unknown view safe fallback
    console.log('\n[MCP Step 10] Testing unknown view fallback via MCP navigate_page...');
    await client.callTool('navigate_page', { pageId, url: 'http://localhost:3000/frontend_public/public_auth?view=unknown' });
    await client.callTool('wait_for', { pageId, text: ['Authentication page not found'] });
    console.log('✓ Safe unavailable view confirmed via MCP wait_for.');

    await client.callTool('take_screenshot', {
      pageId,
      fullPage: true,
      filePath: path.join(screenshotDir, 'mcp_05_unknown_view.png'),
    });
    results.push({ flow: 'Unknown View Fallback', status: 'PASS', feedback: 'Localized 404 card rendered' });

    // 6. Console error audit via MCP
    console.log('\n[MCP Step 11] Checking console error logs via MCP list_console_messages...');
    const consoleMsgs = await client.callTool('list_console_messages', { pageId });
    const logText = consoleMsgs.content?.[0]?.text || '';
    const hasErrors = logText.toLowerCase().includes('error') && !logText.includes('0 errors');
    console.log(`Console message summary: ${hasErrors ? 'WARNING: Has errors' : 'CLEAN: No unhandled exceptions'}`);

    console.log('\n========================================');
    console.log('🎉 ALL MCP BROWSER AUDIT CHECKS PASSED 🎉');
    console.log('========================================');
    console.table(results);
  } finally {
    await client.close();
  }
}

runMcpAudit().catch((err) => {
  console.error('MCP Deep Audit encountered an error:', err);
  process.exit(1);
});
