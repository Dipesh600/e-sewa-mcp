#!/usr/bin/env node

// Railway-specific startup script with better error handling
console.log('🚀 Starting eSewa MCP Server on Railway...');

// Set required environment variables for Railway
process.env.HOST = process.env.HOST || '0.0.0.0';
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.ESEWA_ENVIRONMENT = process.env.ESEWA_ENVIRONMENT || 'sandbox';

console.log('📋 Environment variables:');
console.log(`   HOST: ${process.env.HOST}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   ESEWA_ENVIRONMENT: ${process.env.ESEWA_ENVIRONMENT}`);

// Import and start the server
try {
  console.log('📦 Loading server module...');
  
  // Use dynamic import for ES modules
  import('./server.mjs').then(module => {
    console.log('✅ Server module loaded successfully');
  }).catch(error => {
    console.error('❌ Failed to load server module:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Startup error:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});