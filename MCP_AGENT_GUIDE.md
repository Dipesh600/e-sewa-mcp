# eSewa MCP Server Configuration for Agents

## Quick Setup

### MCP Server URL
```
https://e-sewa-mcp-production.up.railway.app/mcp
```

### Available Tools

1. **configure_credentials** - Set up merchant credentials
2. **initiate_payment** - Create payment sessions  
3. **verify_payment** - Verify completed payments
4. **get_current_config** - Check current configuration
5. **get_test_credentials** - Get sandbox test credentials
6. **get_setup_instructions** - Get setup guidance

## Basic Usage Examples

### 1. Get Test Credentials (Sandbox)
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_test_credentials",
    "arguments": {}
  },
  "id": 1
}
```

### 2. Create Payment Session
```json
{
  "method": "tools/call", 
  "params": {
    "name": "initiate_payment",
    "arguments": {
      "amount": 500,
      "transactionId": "ORDER_12345",
      "successUrl": "https://yourapp.com/success",
      "failureUrl": "https://yourapp.com/failure"
    }
  },
  "id": 2
}
```

### 3. Verify Payment
```json
{
  "method": "tools/call",
  "params": {
    "name": "verify_payment", 
    "arguments": {
      "transactionId": "ORDER_12345",
      "amount": 500
    }
  },
  "id": 3
}
```

### 4. Configure Production Credentials
```json
{
  "method": "tools/call",
  "params": {
    "name": "configure_credentials",
    "arguments": {
      "merchantCode": "YOUR_MERCHANT_CODE",
      "secretKey": "YOUR_SECRET_KEY", 
      "environment": "production"
    }
  },
  "id": 4
}
```

## Test Users (Sandbox)

Use these credentials to test payments in sandbox mode:

**User 1:**
- ID: `9806800001`
- Password: `Nepal@123`
- MPIN: `1122`
- Token: `123456`

**User 2:**
- ID: `9806800002` 
- Password: `Nepal@123`
- MPIN: `1122`
- Token: `123456`

## Session Management

For multi-user scenarios, use session IDs to isolate credentials:

```json
{
  "method": "tools/call",
  "params": {
    "name": "configure_credentials",
    "arguments": {
      "merchantCode": "MERCHANT_CODE",
      "secretKey": "SECRET_KEY",
      "sessionId": "user_123"
    }
  },
  "id": 5
}
```

Then use the same sessionId in subsequent calls:

```json
{
  "method": "tools/call",
  "params": {
    "name": "initiate_payment",
    "arguments": {
      "amount": 1000,
      "transactionId": "TXN_789",
      "successUrl": "https://app.com/success",
      "failureUrl": "https://app.com/failure",
      "sessionId": "user_123"
    }
  },
  "id": 6
}
```

## Complete Payment Flow

1. **Get test credentials** (sandbox only)
2. **Configure credentials** (production only)
3. **Initiate payment** → Returns payment URL
4. **User completes payment** on eSewa platform
5. **Verify payment** → Confirms transaction status

## Error Handling

Common errors and solutions:

- **Invalid credentials**: Use `get_test_credentials` for sandbox or check production credentials
- **Transaction not found**: Verify transactionId and amount parameters
- **Payment failed**: Check success/failure URLs and amount validity

## Environment

- **Sandbox**: Test environment with predefined credentials
- **Production**: Live environment requiring valid merchant account

Default is sandbox mode if no credentials are configured.