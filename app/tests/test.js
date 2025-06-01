const {app, startServer , getConnection, getServer} = require('../app.js');
require('dotenv').config({ path: '.env.test' });
const logger = require('../utils/logger');
const request = require('supertest');
const mongoose = require('mongoose');

let server;
let connection;
let originalDisconnectListener;

// Connect to test database before all tests
beforeAll(async () => {
    try {
        // Store and remove the disconnect listener temporarily
        originalDisconnectListener = mongoose.connection.listeners('disconnected')[0];
        mongoose.connection.removeListener('disconnected', originalDisconnectListener);
        console.log(`mongodb test uri: ${process.env.MONGODB_TEST_URI}`);
        await startServer(`${process.env.MONGODB_TEST_URI}/dinner-app-test`);
        server = getServer();
        connection = getConnection();
        logger.info('Connected to the test database');
    } catch (error) {
        logger.error('Error connecting to the test database:', error);
        throw error; // Let Jest handle the error
    }
});

// Clear all test data after each test
afterEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

// Disconnect from test database after all tests
afterAll(async () => {
    try {
        // First close the server
        await new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        // Then close the database connection
        await mongoose.connection.close();
        
        logger.info("Test cleanup completed successfully");
    } catch (error) {
        logger.error("Error during test cleanup:", error);
        throw error; // Let Jest handle the error
    }
}); 

describe("Auth Routes", () => {
    describe("GET /api/auth/google", () => {
        it("should redirect to Google OAuth login page", async () => {
            const response = await request(app).get("/api/auth/google");
            expect(response.status).toBe(302);
            expect(response.headers.location).toContain("https://accounts.google.com/o/oauth2/v2/auth");
        });
    });
});

