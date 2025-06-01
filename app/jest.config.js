// Jest configuration for Node.js testing environment
module.exports = {
    // Use Node.js environment instead of browser (jsdom)
    testEnvironment: 'node',
    
    // Find test files in any 'tests' directory
    testMatch: ['**/tests/**/*.js'],
    
    // Show detailed test output with individual test names
    verbose: true
   };