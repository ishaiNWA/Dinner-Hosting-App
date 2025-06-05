const { app, startServer, getServer } = require('../app.js');
require('dotenv').config({ path: '.env.test' });
const logger = require('../utils/logger');
const request = require('supertest');
const mongoose = require('mongoose');
const mocFunctions = require('./mocks/moc-functions');
const mocData = require('./mocks/moc-data');
const { userRoles } = require('../common/user-roles');

let server;
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
        logger.info('Connected to the test database');

        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    } catch (error) {
        logger.error('Error connecting to the test database:', error);
        throw error; // Let Jest handle the error
    }
});

// Clear all test data before each test
beforeEach(async () => {
    console.log('Collections:', Object.keys(mongoose.connection.collections));
    const collections = mongoose.connection.collections;
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

    describe("GET /api/auth/google/callback", () => {
        it("should generate cookie and redirect to appropriate page based on registration status", async () => {
            // Test new user flow
            mocFunctions.setupGoogleStrategyMock(false);
            let response = await request(app).get("/api/auth/google/callback").send();

            expect(response.status).toBe(303);
            expect(response.headers.location).toBe("https://example.com/complete-registration");
            const setCookieHeaderArray = response.headers['set-cookie'];
            expect(setCookieHeaderArray).toBeDefined();
            expect(setCookieHeaderArray.some(cookie => cookie.includes('jwt'))).toBe(true);

            mocFunctions.setupGoogleStrategyMock(true);
            response = await request(app).get("/api/auth/google/callback").send();
            expect(response.status).toBe(303);
            expect(response.headers.location).toBe("https://example.com/dashboard");
        });
    });

    describe("POST /api/auth/complete-registration", () => {
        it("should create a valid Guest-user with in DB with isRegistrationComplete set to true", async () => {
            const seedUser = await mocFunctions.seedInitialUserInDB();
            const cookie = mocFunctions.createAuthCookieForMockUser(seedUser);
            const userDataForm = mocData.mockValidGuestData;

            const response = await request(app)
                .post("/api/auth/complete-registration")
                .send({ userDataForm })
                .set('Cookie', cookie);

            if (response.status !== 200) {
                console.log('\nTest Failed Details:');
                console.log('Response Status:', response.status);
                console.log(' error message:', (response.body.error.message));
                console.log('Response data:', (response.body.error.data));
            }

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User completed registration successfully");
            expect(response.body.user.isRegistrationComplete).toBe(true);
            expect(response.body.user.role).toBe(userRoles.GUEST);
            expect(response.body.user.phoneNumber).toBe(userDataForm.roleDetails.contactDetails.phoneNumber);
            expect(response.body.user.address).toBe(userDataForm.roleDetails.contactDetails.address);
        });

        it("should create a valid Host-user with in DB with isRegistrationComplete set to true", async () => {
            const seedUser = await mocFunctions.seedInitialUserInDB();
            const cookie = mocFunctions.createAuthCookieForMockUser(seedUser);
            const userDataForm = mocData.mockValidHostData;

            const response = await request(app)
                .post("/api/auth/complete-registration")
                .send({ userDataForm })
                .set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User completed registration successfully");
            expect(response.body.user.isRegistrationComplete).toBe(true);
            expect(response.body.user.role).toBe(userRoles.HOST);
            expect(response.body.user.phoneNumber).toBe(userDataForm.roleDetails.contactDetails.phoneNumber);
        });

        it("should not create an INVALID  Guest-user and return 400 status code", async () => {
            const seedUser = await mocFunctions.seedInitialUserInDB();
            const cookie = mocFunctions.createAuthCookieForMockUser(seedUser);
            const userDataForm = mocData.mockInvalidGuestData;

            const response = await request(app)
                .post("/api/auth/complete-registration")
                .send({ userDataForm })
                .set('Cookie', cookie);

            expect(response.status).toBe(400);
        });

        it("should not create an INVALID  Host-user and return 400 status code", async () => {
            const seedUser = await mocFunctions.seedInitialUserInDB();
            const cookie = mocFunctions.createAuthCookieForMockUser(seedUser);
            const userDataForm = mocData.mockInvalidHostData;

            const response = await request(app)
                .post("/api/auth/complete-registration")
                .send({ userDataForm })
                .set('Cookie', cookie);

            expect(response.status).toBe(400);
        });

        it("sholud try to create a already complete-registered user and return 400 status code", async () => {
            const seedUser = await mocFunctions.seedCompleteUserInDB();
            const cookie = mocFunctions.createAuthCookieForMockUser(seedUser);
            const userDataForm = mocData.mockValidGuestData;

            const response = await request(app)
                .post("/api/auth/complete-registration")
                .send({ userDataForm })
                .set('Cookie', cookie);

            expect(response.status).toBe(400);
            expect(response.error.text).toContain("User already completed profile");
        });

        it("should try use bad cookie and return 401 status code", async () => {
            const userDataForm = mocData.mockValidGuestData;
            const cookie = mocFunctions.createBadCookie(userDataForm);

            const response = await request(app)
                .post("/api/auth/complete-registration")
                .send({ userDataForm })
                .set('Cookie', 'bad-cookie');

            expect(response.status).toBe(401);
            expect(response.error.text).toContain("Unauthorized");
        });

        it.only("should retrieve user data for getMe route. and after logout should return 401 status code", async () => {
            const seedUser = await mocFunctions.seedCompleteUserInDB();
            const cookie = mocFunctions.createAuthCookieForMockUser(seedUser);

            let response;
            response = await request(app)
                .get("/api/user/me")
                .set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe(seedUser.email);

                response = await request(app)
                    .post("/api/auth/logout")
                    .set('Cookie', cookie);
                    

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Logged out successfully");

            response = await request(app)
                .get("/api/user/me")
                .set('Cookie', cookie);

            expect(response.status).toBe(401);
            expect(response.error.text).toContain("Unauthorized");
        });
    });
});
