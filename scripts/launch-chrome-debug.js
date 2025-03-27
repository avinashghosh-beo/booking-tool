const CDP = require('chrome-remote-interface');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_DEBUG_PORT = 9222;

async function launchChromeWithDebug() {
  // Chrome executable paths for different OS
  const chromePaths = {
    win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    linux: '/usr/bin/google-chrome'
  };

  const chromePath = chromePaths[process.platform];
  const userDataDir = path.join(__dirname, '..', '.chrome-debug');

  const chromeProcess = spawn(chromePath, [
    `--remote-debugging-port=${CHROME_DEBUG_PORT}`,
    '--disable-web-security',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:3000'
  ]);

  chromeProcess.on('error', (err) => {
    console.error('Failed to launch Chrome:', err);
  });

  return chromeProcess;
}

async function connectToChrome() {
  try {
    const client = await CDP({
      port: CHROME_DEBUG_PORT
    });

    const { Console, Page, Runtime } = client;

    // Enable events
    await Promise.all([
      Console.enable(),
      Page.enable(),
      Runtime.enable()
    ]);

    // Listen for console messages
    Console.messageAdded(({ message }) => {
      const { level, text, url, line, column } = message;
      console.log(`[${level}] ${text} (${url}:${line}:${column})`);
    });

    // Listen for console.log calls
    Runtime.consoleAPICalled(({ type, args, stackTrace }) => {
      const values = args.map(arg => arg.value || arg.description).join(' ');
      console.log(`[${type}] ${values}`);
      if (stackTrace) {
        console.log('Stack:', stackTrace);
      }
    });

    // Handle errors
    Runtime.exceptionThrown(({ exceptionDetails }) => {
      console.error('Exception:', exceptionDetails);
    });

    return client;
  } catch (err) {
    console.error('Failed to connect to Chrome:', err);
    throw err;
  }
}

async function main() {
  const chrome = await launchChromeWithDebug();
  console.log('Chrome launched with debugging enabled');

  try {
    const client = await connectToChrome();
    console.log('Connected to Chrome DevTools Protocol');

    // Handle process termination
    process.on('SIGINT', async () => {
      console.log('Cleaning up...');
      await client.close();
      chrome.kill();
      process.exit();
    });
  } catch (err) {
    console.error('Failed to initialize:', err);
    chrome.kill();
    process.exit(1);
  }
}

main(); 