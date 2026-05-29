const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_PROJECT = '@org/server-ai';
const WEB_PROJECT = '@org/web-ai';
const SERVER_PORT = Number(process.env.SERVER_AI_PORT || 3333);
const WAIT_TIMEOUT_MS = 20000;
const CHECK_INTERVAL_MS = 250;

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('error', () => {
      resolve(false);
    });
  });
}

async function waitForPort(port, host = '127.0.0.1', timeout = WAIT_TIMEOUT_MS) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await isPortOpen(port, host)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL_MS));
  }

  return false;
}

function spawnCommand(command, args, options) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  });

  child.on('error', (error) => {
    console.error(`Failed to start ${command} ${args.join(' ')}`);
    console.error(error);
  });

  return child;
}

function killChildren(children) {
  for (const child of children) {
    if (!child || child.killed) continue;
    try {
      child.kill('SIGINT');
    } catch (error) {
      // ignore
    }
  }
}

async function main() {
  const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const children = [];

  const serverRunning = await isPortOpen(SERVER_PORT);

  if (!serverRunning) {
    console.log('Starting server-ai...');
    const serverProcess = spawnCommand(pnpmBin, ['exec', 'nx', 'serve', SERVER_PROJECT], {
      cwd: ROOT_DIR,
      env: process.env,
    });
    children.push(serverProcess);

    const started = await waitForPort(SERVER_PORT);
    if (!started) {
      console.error(
        `server-ai did not start on port ${SERVER_PORT} within ${WAIT_TIMEOUT_MS}ms.`
      );
      killChildren(children);
      process.exit(1);
    }

    console.log(`server-ai is running at http://localhost:${SERVER_PORT}`);
  } else {
    console.log(`server-ai already running at http://localhost:${SERVER_PORT}`);
  }

  console.log('Starting web-ai...');
  const webProcess = spawnCommand(pnpmBin, ['exec', 'nx', 'serve', WEB_PROJECT], {
    cwd: ROOT_DIR,
    env: process.env,
  });
  children.push(webProcess);

  const cleanup = () => {
    killChildren(children);
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
