const { app, startServer, getServer } = require('../app.js');
require('dotenv').config({ path: '.env.test' });
const logger = require('../utils/logger');
const request = require('supertest');
const mongoose = require('mongoose');
const mocFunctions = require('./mocks/moc-functions');
const mocData = require('./mocks/moc-data');
const { userRoles } = require('../common/user-roles');
const dbService = require('../services/db-service');
const eventStatuses = require('../common/event-statuses');

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

            const postResponses = [];
            for(const event of eventArray){
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                postResponses.push(response);
            }

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

        it("should create 3 events and query for specific event using all filter parameters", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const guestCookie = mocFunctions.createAuthCookieForMockUser(guestUser);
            const eventArray = mocFunctions.getMockValidEventArray();

            const postResponses = [];
            for(const event of eventArray){
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                postResponses.push(response);
            }

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
            expect(returnedEvent.dietary.additionalOptions).toBe(targetEvent.dietary.additionalOptions);
            
        });

        it("GET published - should return amount of published events according to eventStatuses filter", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const eventArray = mocFunctions.getMockValidEventArray();

            const postResponses = [];
            for(const event of eventArray){
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                postResponses.push(response);
            }
            expect(postResponses.length).toBe(3);

            let getPublishedResponse = await request(app)
                .get("/api/events/published?eventStatuses=OPEN_FOR_REGISTRATION")
                .set('Cookie', hostCookie);
            expect(getPublishedResponse.status).toBe(200);
            expect(getPublishedResponse.body.count).toBe(3);

            const firstEventId = postResponses[0].body.data.eventId;

            await dbService.updateEventStatus({_id : firstEventId}, eventStatuses.FULLY_BOOKED);

            getPublishedResponse = await request(app)
                .get("/api/events/published?eventStatuses=OPEN_FOR_REGISTRATION")
                .set('Cookie', hostCookie);
                
            expect(getPublishedResponse.status).toBe(200);
            expect(getPublishedResponse.body.count).toBe(2);
            expect(getPublishedResponse.body.data.length).toBe(2);
        });
        it("GET /published/:eventId - should return 200 and event details if event is found, and 404 if event does not found", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const eventArray = mocFunctions.getMockValidEventArray();

            const postResponses = [];
            for(const event of eventArray){
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                postResponses.push(response);
            }
            expect(postResponses.length).toBe(3);
            expect(postResponses.every(response => response.status === 201)).toBe(true);

            let eventId = postResponses[0].body.data.eventId;

            console.log(`PUBLISHED eventId: ${eventId}`);

            let getPublishedSingleEventResponse = await request(app)
                .get(`/api/events/published/${eventId}`)
                .set('Cookie', hostCookie);

            expect(getPublishedSingleEventResponse.status).toBe(200);
            expect(getPublishedSingleEventResponse.body.data.eventId).toBe(eventId);
            expect(getPublishedSingleEventResponse.body.data.location.address).toBe(eventArray[0].eventForm.location.address);

            //replace last 4 digits with 0000
            eventId = eventId.slice(0, -4) + '0000';

            getPublishedSingleEventResponse = await request(app)
                .get(`/api/events/published/${eventId}`)
                .set('Cookie', hostCookie);

            expect(getPublishedSingleEventResponse.status).toBe(404);
        });
        it("should update an event status when proper eventStatuses value is passed",async ()=>{
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const eventObject = mocFunctions.getMockValidSingleEvent();

            const eventResponse = await request(app)
            .post("/api/events")
            .send(eventObject)
            .set('Cookie', hostCookie);

            expect(eventResponse.status).toBe(201);
            expect(eventResponse.body.message).toBe("Event published successfully");

            let eventId = eventResponse.body.data.eventId;

            let getEventResponse = await request(app)
            .get(`/api/events/published/${eventId}`)
            .set('Cookie', hostCookie);


            expect(getEventResponse.body.data.status.current).toBe(eventStatuses.OPEN_FOR_REGISTRATION);

            const changeStatusResponse = await request(app)
            .patch(`/api/events/published/${eventId}/status`)
            .send({status : eventStatuses.FULLY_BOOKED})
            .set("Cookie" , hostCookie);

            expect(changeStatusResponse.status).toBe(200);
            expect(changeStatusResponse.body.newStatus).toBe(eventStatuses.FULLY_BOOKED);

        })
    });



    describe("/booking", () => {
        it("should return 201 for POST /booking", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const eventObject = mocFunctions.getMockValidSingleEvent();



            const eventResponse = await request(app)
                .post("/api/events")
                .send(eventObject)
                .set('Cookie', hostCookie);

            expect(eventResponse.status).toBe(201);
            expect(eventResponse.body.message).toBe("Event published successfully");
           
            const eventId = eventResponse.body.data.eventId;
            const bookingForm = mocFunctions.prepareMockValidBookingForm(guestUser._id);

            const bookingResponse = await request(app)
                .post(`/api/events/${eventId}/booking`)
                .send({ bookingForm })
                .set('Cookie', hostCookie);

            expect(bookingResponse.status).toBe(201);

            const guestUserDoc = await dbService.findUserByDocId(guestUser._id );
            expect(guestUserDoc.upcomingEvents.length).toBe(1);
            expect(guestUserDoc.upcomingEvents[0].toString()).toBe(eventId);

            const eventDoc = await dbService.findEventByDocId(eventId);
            expect(eventDoc.bookedParticipants.length).toBe(1);
            expect(eventDoc.bookedParticipants[0].guestId.toString()).toBe(guestUser._id.toString());
        });
        it("for POST /booking, should return 400, and error message of: `Guest is already booked for another event in this date`", async () => {
            const firstHostUser = await mocFunctions.seedCompleteHostUserInDB();
            const secondHostUser = await mocFunctions.seedSecondCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const firstHostCookie = mocFunctions.createAuthCookieForMockUser(firstHostUser);
            const secondHostCookie = mocFunctions.createAuthCookieForMockUser(secondHostUser);
            const eventObject = mocFunctions.getMockValidSingleEvent();


            const firstEventResponse = await request(app)
                .post("/api/events")
                .send(eventObject)
                .set('Cookie', firstHostCookie);
                
            expect(firstEventResponse.status).toBe(201);
            expect(firstEventResponse.body.message).toBe("Event published successfully");

            const secondEventResponse = await request(app)
                .post("/api/events")
                .send(eventObject)
                .set('Cookie', secondHostCookie);

                expect(secondEventResponse.status).toBe(201);
                expect(secondEventResponse.body.message).toBe("Event published successfully");

            const firstEventId = firstEventResponse.body.data.eventId;
            const secondEventId = secondEventResponse.body.data.eventId;

            const bookingForm = mocFunctions.prepareMockValidBookingForm(guestUser._id);

            const firstBookingResponse = await request(app)
                .post(`/api/events/${firstEventId}/booking`)
                .send({ bookingForm })
                .set('Cookie', firstHostCookie);

            expect(firstBookingResponse.status).toBe(201);

            const secondBookingResponse = await request(app)
                .post(`/api/events/${secondEventId}/booking`)
                .send({ bookingForm })
                .set('Cookie', secondHostCookie);

            expect(secondBookingResponse.status).toBe(400);
            expect(secondBookingResponse.error.text).toContain("Guest is already booked for another event in this date");
                
        });
        it("GET /upcoming/  AND DELETE /booking/:guestId - should return 3 booked events berfore DELETE, and 2 after DELETE", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const guestCookie = mocFunctions.createAuthCookieForMockUser(guestUser)
            const eventArray = mocFunctions.getMockValidEventArray();

            const postResponses = [];
            for(const event of eventArray){
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                postResponses.push(response);
            }

            expect(postResponses.length).toBe(3);
            for(const event of postResponses){
                expect(event.status).toBe(201);
            }

            let eventIds = [];
            for(const event of postResponses){
                eventIds.push(event.body.data.eventId);
            }

            const bookingForm = mocFunctions.prepareMockValidBookingForm(guestUser._id);

            for(const eventId of eventIds){
                const bookingResponse = await request(app)
                    .post(`/api/events/${eventId}/booking`)
                    .send({ bookingForm })
                    .set('Cookie', hostCookie);
                expect(bookingResponse.status).toBe(201);
            }

            const getUpcomingEventsResponse = await request(app)
                .get("/api/events/upcoming")
                .set('Cookie', guestCookie);

            expect(getUpcomingEventsResponse.status).toBe(200);
            expect(getUpcomingEventsResponse.body.count).toBe(3);

            let guestUserDoc = await dbService.findUserByDocId(guestUser._id);
            expect(guestUserDoc.upcomingEvents.includes(eventIds[0])).toBe(true);
            expect(guestUserDoc.upcomingEvents.length).toBe(3);


            //delete the booking
            const deleteResponse = await request(app)
                .delete(`/api/events/${eventIds[0]}/booking/${guestUser._id}`)
                .set('Cookie', hostCookie);

            expect(deleteResponse.status).toBe(200);

            
            const getUpcomingEventsResponseAfterDelete = await request(app)
                .get("/api/events/upcoming")
                .set('Cookie', guestCookie);

            //check that the event is not in the upcoming events
            expect(getUpcomingEventsResponseAfterDelete.status).toBe(200);
            expect(getUpcomingEventsResponseAfterDelete.body.count).toBe(2);
            expect(getUpcomingEventsResponseAfterDelete.body.data.includes(eventIds[0])).toBe(false);
            
        });
        it("GET /upcoming/:eventId - should return 200 and event details if event is found, and 404 if event does not found", async () => {
            const hostUser = await mocFunctions.seedCompleteHostUserInDB();
            const guestUser = await mocFunctions.seedCompleteGuestUserInDB();
            const hostCookie = mocFunctions.createAuthCookieForMockUser(hostUser);
            const guestCookie = mocFunctions.createAuthCookieForMockUser(guestUser);
            const eventArray = mocFunctions.getMockValidEventArray();

            const postResponses = [];
            for(const event of eventArray){
                const response = await request(app)
                    .post("/api/events")
                    .send(event)
                    .set('Cookie', hostCookie);
                postResponses.push(response);
            }

            expect(postResponses.length).toBe(3);
            for(const event of postResponses){
                expect(event.status).toBe(201);
            }

            let eventId = postResponses[0].body.data.eventId;

            const bookingForm = mocFunctions.prepareMockValidBookingForm(guestUser._id);

            const bookingResponse = await request(app)
            .post(`/api/events/${eventId}/booking`)
            .send({ bookingForm })
            .set('Cookie', hostCookie);
            expect(bookingResponse.status).toBe(201);
        

            let getUpcomingSingleEventResponse = await request(app)
                .get(`/api/events/upcoming/${eventId}`)
                .set('Cookie', guestCookie);

            expect(getUpcomingSingleEventResponse.status).toBe(200);
            expect(getUpcomingSingleEventResponse.body.data.eventId).toBe(eventId);
            expect(getUpcomingSingleEventResponse.body.data.address).toBe(eventArray[0].eventForm.location.address);

            //replace last 4 digits with 0000
            eventId = eventId.slice(0, -4) + '0000';

            getUpcomingSingleEventResponse = await request(app)
                .get(`/api/events/upcoming/${eventId}`)
                .set('Cookie', guestCookie);

            expect(getUpcomingSingleEventResponse.status).toBe(404);
        }); 
    });
});

