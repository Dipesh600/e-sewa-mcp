#!/bin/bash

HEADERS='-H "Content-Type: application/json" -H "Accept: application/json, text/event-stream"'

echo "🧪 Testing eSewa MCP Server"
echo "================================"

echo -e "\n1️⃣ Health Check"
curl -s http://localhost:3000/ | jq

echo -e "\n2️⃣ List Tools"
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq

echo -e "\n3️⃣ Get Test Credentials"  
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_test_credentials","arguments":{}}}' | jq

echo -e "\n4️⃣ Initiate Payment"
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"initiate_payment","arguments":{"amount":1000,"transactionId":"TEST-001","successUrl":"https://test.com/success","failureUrl":"https://test.com/failure"}}}' | jq

echo -e "\n✅ Tests complete!"