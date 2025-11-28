#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 5000;

async function testConnection() {
  console.log('🔍 Testing eSewa MCP Server Connection...\n');
  
  const tests = [
    {
      name: 'Health Check',
      endpoint: '/',
      method: 'GET'
    },
    {
      name: 'List Tools',
      endpoint: '/mcp',
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: `${BASE_URL}${test.endpoint}`,
        timeout: TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        }
      };
      
      if (test.data) {
        config.data = test.data;
      }
      
      const response = await axios(config);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${test.name}: PASSED`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        failed++;
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`   Error: Connection refused - Server may not be running`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`   Error: Connection timeout - Server may be slow or unreachable`);
      } else if (error.response) {
        console.log(`   Error: HTTP ${error.response.status} - ${error.response.statusText}`);
        console.log(`   Response: ${JSON.stringify(error.response.data, null, 2).substring(0, 200)}...`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
      
      failed++;
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed > 0) {
    console.log(`\n💡 Troubleshooting Tips:`);
    console.log(`   1. Make sure the server is running: npm start`);
    console.log(`   2. Check if port 3000 is available: netstat -an | grep 3000`);
    console.log(`   3. Check server logs for errors`);
    console.log(`   4. Verify all dependencies are installed: npm install`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
testConnection().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});