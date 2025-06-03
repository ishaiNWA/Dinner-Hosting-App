// Jest configuration for Node.js testing environment
module.exports = {
    testTimeout: 30000,  // 30 seconds
    testEnvironment: 'node',
    
    // Find test files in any 'tests' directory
    testMatch: ['**/tests/**/*.test.js', '**/tests/test.js'],
    
    // Ignore mock files and helpers
    testPathIgnorePatterns: [
        '/node_modules/',
        '/tests/mocks/',
        '/tests/helpers/'
    ],

    // Show detailed test output with individual test names
    verbose: true
};