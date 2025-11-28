# eSewa MCP Server

A Model Context Protocol (MCP) server for integrating eSewa payment gateway with AI applications. This server provides a standardized interface for handling eSewa payments through the MCP protocol.

## Features

- **Dynamic Credential Configuration**: Configure merchant credentials per session
- **Sandbox & Production Support**: Switch between testing and live environments
- **Session-Based Management**: Handle multiple users with separate credential stores
- **JSON-RPC 2.0 Compliant**: Standard MCP protocol implementation
- **Health Monitoring**: Built-in health checks and status endpoints
- **Error Handling**: Comprehensive error handling and validation
- **HMAC Signature Verification**: Secure payment verification using HMAC-SHA256

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- eSewa merchant account (for production)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd esewa-mcp-server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the server
npm start
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# eSewa API Configuration
ESEWA_ENVIRONMENT=sandbox  # or 'production'

# Optional: Default merchant credentials
ESEWA_MERCHANT_CODE=your_merchant_code
ESEWA_SECRET_KEY=your_secret_key

# Security Configuration
CORS_ORIGIN=https://yourdomain.com
SESSION_SECRET=your_session_secret_here

# Logging
LOG_LEVEL=info
```

## API Endpoints

### Health Check
```
GET /
```
Returns server status and available features.

### MCP Endpoint
```
POST /mcp
```
Main MCP protocol endpoint for tool discovery and execution.

### SSE Endpoint
```
GET /sse
```
Server-Sent Events endpoint for real-time communication.

### Messages Endpoint
```
POST /messages
```
Handle incoming messages from MCP clients.

## Available Tools

### configure_credentials
Configure eSewa merchant credentials for the session.

**Parameters:**
- `merchantCode` (string): Your eSewa merchant code
- `secretKey` (string): Your eSewa secret key  
- `environment` (string): 'sandbox' or 'production'
- `sessionId` (string, optional): Session ID for credential storage

### get_test_credentials
Get sandbox test credentials for development.

### initiate_payment
Initiate an eSewa payment.

**Parameters:**
- `amount` (number): Payment amount
- `productCode` (string): Product/service code
- `successUrl` (string): URL for successful payment redirect
- `failureUrl` (string): URL for failed payment redirect

### verify_payment
Verify a completed payment.

**Parameters:**
- `amount` (number): Expected payment amount
- `referenceId` (string): eSewa transaction reference ID
- `productCode` (string): Product/service code

### get_payment_status
Get the status of a payment.

**Parameters:**
- `referenceId` (string): eSewa transaction reference ID

### get_test_users
Get test user credentials for sandbox testing.

## Testing

### Connection Test
```bash
npm run test:connection
```

### Full Test Suite
```bash
npm run test:all
```

### Manual Testing
```bash
# Start server with validation
npm run start:safe

# Test health endpoint
curl http://localhost:3000/

# Test MCP endpoint
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list", "id": 1}'
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production
export PORT=3000

# Start server
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables for Production

- `NODE_ENV=production`
- `PORT=3000` (or your preferred port)
- `ESEWA_ENVIRONMENT=production`
- `ESEWA_MERCHANT_CODE=your_production_merchant_code`
- `ESEWA_SECRET_KEY=your_production_secret_key`
- `SESSION_SECRET=strong_random_string`
- `CORS_ORIGIN=your_domain`

## Security Considerations

1. **Never commit `.env` files** containing real credentials
2. **Use HTTPS** in production for all endpoints
3. **Validate all inputs** on both client and server
4. **Store credentials securely** using environment variables
5. **Use strong session secrets** for production deployments
6. **Implement rate limiting** for production use
7. **Monitor logs** for suspicious activity

## eSewa Integration

### Sandbox Environment
- Use test credentials from `get_test_credentials` tool
- Test users provided for payment simulation
- No real money transactions

### Production Environment  
- Requires valid eSewa merchant account
- Real money transactions
- Secure credential management required

### Payment Flow
1. Configure credentials using `configure_credentials`
2. Initiate payment using `initiate_payment`
3. User completes payment on eSewa portal
4. Verify payment using `verify_payment`
5. Check status using `get_payment_status`

## Error Handling

The server provides detailed error messages for:
- Invalid credentials
- Network timeouts
- Payment verification failures
- Session management issues
- Parameter validation errors

## Monitoring

Monitor these endpoints for health:
- `/` - Basic health check
- Server logs for errors and warnings
- Payment success/failure rates
- Response times for API calls

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Connection Refused**
- Check if server is running
- Verify port configuration
- Check firewall settings

**MCP Connection Issues**
- Verify MCP client configuration
- Check server logs for errors
- Test with `npm run test:connection`

**Payment Verification Fails**
- Verify merchant credentials
- Check eSewa environment (sandbox vs production)
- Validate payment parameters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs for error details
3. Test with provided test scripts
4. Open an issue on GitHub

## Changelog

### v1.0.0
- Initial release
- MCP protocol implementation
- eSewa payment integration
- Session-based credential management
- Health monitoring and error handling