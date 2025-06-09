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

        it("should retrieve user data for getMe route. and after logout should return 401 status code", async () => {
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

    describe("/events", () => {
        it("should return 201 for 3 POST /events creation. and 200 for GET /events with count === 3 ", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const guestCookie = mocFunctions.createAuthCookieForMockUser(guestUser);
            const eventArray = mocFunctions.getMockValidEventArray();

            const postResponses = await Promise.all(eventArray.map(async (event) => {
                return await request(app)
                    .post("/api/events")
                    .send( event)
                    .set('Cookie', hostCookie);
            }));

         //   console.log(`postResponses: ${JSON.stringify(postResponses[0])}`);

            expect(postResponses.length).toBe(3);
            expect(postResponses.every(response => response.status === 201)).toBe(true);
            
            // Test GET /events returns the 3 created events
            const getResponse = await request(app)
                .get("/api/events")
                .set('Cookie', guestCookie);
                
            expect(getResponse.status).toBe(200);
            expect(getResponse.body.count).toBe(3);
        });

        it("should return status code 400, and error message of : `You already have an event scheduled for this date`", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const duplicateEventArray = mocFunctions.getDuplicateEventArray();

            const responses = [];
            
            // Send requests sequentially to avoid race condition
            for (const event of duplicateEventArray) {
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                responses.push(response);
            }

            console.log(`responses[2]: ${JSON.stringify(responses[2])}`);

            expect(responses[2].status).toBe(400);
            expect(responses[2].error.text).toContain("You already have an event scheduled for this date");
        });

        it.only("should create 3 events and query for specific event using all filter parameters", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const guestCookie = mocFunctions.createAuthCookieForMockUser(guestUser);
            const eventArray = mocFunctions.getMockValidEventArray();

            // Create all 3 events
            const postResponses = await Promise.all(eventArray.map(async (event) => {
                return await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
            }));

            expect(postResponses.length).toBe(3);
            expect(postResponses.every(response => response.status === 201)).toBe(true);

            // Query for Event 2 specifically (the only one with isKosher=false AND isVeganFriendly=true)
            const targetEvent = eventArray[1].eventForm; // Event 2: isKosher=false, isVeganFriendly=true
            const targetDate = targetEvent.timing.eventDate.toISOString().split('T')[0]; // YYYY-MM-DD format

            const queryResponse = await request(app)
                .get(`/api/events?isKosher=false&isVeganFriendly=true&eventDate=${targetDate}`)
                .set('Cookie', guestCookie);

            expect(queryResponse.status).toBe(200);
            expect(queryResponse.body.success).toBe(true);
            expect(queryResponse.body.count).toBe(1);
            
            // Verify the returned event matches our target
            const returnedEvent = queryResponse.body.data[0];
            expect(returnedEvent.dietary.isKosher).toBe(false);
            expect(returnedEvent.dietary.isVeganFriendly).toBe(true);
            expect(returnedEvent.location.address).toBe(targetEvent.location.address);
            expect(returnedEvent.capacity.total).toBe(targetEvent.capacity.total);
            expect(returnedEvent.dietary.additionalOptions).toBe(targetEvent.dietary.additionalOptions);
            
        });
    });
});

