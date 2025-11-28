#!/usr/bin/env node

import { spawn } from 'child_process';
import axios from 'axios';

const SERVER_START_TIMEOUT = 10000; // 10 seconds
const SERVER_HEALTH_CHECK_INTERVAL = 2000; // 2 seconds

console.log('🚀 Starting eSewa MCP Server with validation...\n');

// Start the server
const serverProcess = spawn('node', ['server.mjs'], {
  stdio: 'inherit',
  shell: true
});

// Wait for server to start
async function waitForServer() {
  const startTime = Date.now();
  
  while (Date.now() - startTime < SERVER_START_TIMEOUT) {
    try {
      const response = await axios.get('http://localhost:3000/', {
        timeout: 2000
      });
      
      if (response.status === 200 && response.data.status === 'healthy') {
        console.log('\n✅ Server is running and healthy!');
        console.log('📍 Health check: http://localhost:3000/');
        console.log('📍 MCP endpoint: http://localhost:3000/mcp');
        console.log('📍 SSE endpoint: http://localhost:3000/sse');
        return true;
      }
    } catch (error) {
      // Server not ready yet, continue waiting
      process.stdout.write('.');
    }
    
    await new Promise(resolve => setTimeout(resolve, SERVER_HEALTH_CHECK_INTERVAL));
  }
  
  return false;
}

// Handle server startup
serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
  }
  process.exit(code);
});

// Wait for server and validate
waitForServer().then(isRunning => {
  if (!isRunning) {
    console.error('\n❌ Server failed to start within timeout');
    serverProcess.kill();
    process.exit(1);
  }
  
  console.log('\n🎯 Server validation complete! You can now:');
  console.log('   - Test with: node test-connection.js');
  console.log('   - Run full tests: ./test-mcp.sh');
  console.log('   - Use MCP client to connect to http://localhost:3000');
}).catch(error => {
  console.error('❌ Validation failed:', error);
  serverProcess.kill();
  process.exit(1);
});