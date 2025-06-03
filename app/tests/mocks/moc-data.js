const {userRoles} = require("../../common/user-roles");
const {dietaryRestrictionsArray} = require("../../common/dietary-restrictions");

// Mock Google profile data
const mockGoogleProfile = {
    id: '12345',
    _json: {
        email: 'test@example.com',
        given_name: 'Test',
        family_name: 'User',
    }
};

const mocInitialUser = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isRegistrationComplete: false
};

// Valid mock data for guest registration
const mockValidGuestData = {
    role: userRoles.GUEST,
    roleDetails: {
        contactDetails: {
            phoneNumber: '0521234567',
            address: '123 Test Street, Test City'
        },
        dietaryRestrictions: [dietaryRestrictionsArray[0], dietaryRestrictionsArray[3]],
        allergies: 'none'
    }
};

// Valid mock data for host registration
const mockValidHostData = {
    role: userRoles.HOST,
    roleDetails: {
        contactDetails: {
            phoneNumber: '0529876543',
            address: '456 Host Avenue, Host City'
        }
    }
};

const mockValidCompleteUser = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    isRegistrationComplete: true,
    _id: "683ee3220b4859bd42d033d1",
    __v: 0,
    role: "Host",
    isAuthorizedByManager: false,
    publishedDinnerEvent: [],
    phoneNumber: "0529876543",
    address: "456 Host Avenue, Host City"
  }


// Invalid mock data for testing validation
const mockInvalidUserData = {
    // Missing role
    roleDetails: {
        contactDetails: {
            phoneNumber: '0521234567',
            address: '123 Test Street'
        }
    }
};

const mockInvalidGuestData = {
    role: userRoles.GUEST,
    roleDetails: {
        contactDetails: {
            phoneNumber: '052123', // Invalid phone format
            address: 'a'  // Too short
        },
        dietaryRestrictions: [], // Empty array - should have at least one
        allergies: ''  // Empty string is allowed but not recommended
    }
};

const mockInvalidHostData = {
    role: userRoles.HOST,
    roleDetails: {
        contactDetails: {
            phoneNumber: 'not-a-phone', // Invalid phone format
            // Missing address
        }
    }
};

module.exports = {
    mockGoogleProfile,
    mocInitialUser,
    mockValidGuestData,
    mockValidHostData,
    mockValidCompleteUser,
    mockInvalidUserData,
    mockInvalidGuestData,
    mockInvalidHostData
}; 