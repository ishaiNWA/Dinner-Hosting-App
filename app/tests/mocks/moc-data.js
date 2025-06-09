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


  const mockValidCompleteHostUser = {
    firstName: "TestHost",
    lastName: "HostUser",
    email: "HostTest@example.com",
    isRegistrationComplete: true,
    _id: "683ee3220b4859bd42d033d2",
    __v: 0,
    role: userRoles.HOST,
    isAuthorizedByManager: false,
    publishedDinnerEvent: [],
    phoneNumber: "0529876543",
    address: "456 Host Avenue, Host City"
  }


  const mockValidCompleteGuestUser = {
    firstName: "TestGuest",
    lastName: "GuestUser",
    email: "GuestTest@example.com",
    isRegistrationComplete: true,
    _id: "683ee3220b4859bd42d033d3",
    __v: 0,
    role: userRoles.GUEST,
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



const mockValidEventArray = [
    {
        eventForm: {
            timing: {
                eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
            },
            location: {
                address: "123 Dinner Street, Tel Aviv, Israel"
            },
            capacity: {
                total: 8
            },
            dietary: {
                isKosher: true,
                isVeganFriendly: false,
                additionalOptions: "Gluten-free options available"
            }
        }
    },
    {
        eventForm: {
            timing: {
                eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
            },
            location: {
                address: "456 Host Avenue, Jerusalem, Israel"
            },
            capacity: {
                total: 6
            },
            dietary: {
                isKosher: false,
                isVeganFriendly: true,
                additionalOptions: "Organic ingredients only"
            }
        }
    },
    {
        eventForm: {
            timing: {
                eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
            },
            location: {
                address: "789 Culinary Road, Haifa, Israel"
            },
            capacity: {
                total: 12
            },
            dietary: {
                isKosher: true,
                isVeganFriendly: true
                // additionalOptions is optional, so omitting it here
            }
        }
    }
]




const mockDuplicateEventArray = [
    {
        eventForm: {
            timing: {
                eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
            },
            location: {
                address: "123 Dinner Street, Tel Aviv, Israel"
            },
            capacity: {
                total: 8
            },
            dietary: {
                isKosher: true,
                isVeganFriendly: false,
                additionalOptions: "Gluten-free options available"
            }
        }
    },
    {
        eventForm: {
            timing: {
                eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
            },
            location: {
                address: "456 Host Avenue, Jerusalem, Israel"
            },
            capacity: {
                total: 6
            },
            dietary: {
                isKosher: false,
                isVeganFriendly: true,
                additionalOptions: "Organic ingredients only"
            }
        }
    },
    {
        eventForm: {
            timing: {
                eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
            },
            location: {
                address: "789 Culinary Road, Haifa, Israel"
            },
            capacity: {
                total: 12
            },
            dietary: {
                isKosher: true,
                isVeganFriendly: true
                // additionalOptions is optional, so omitting it here
            }
        }
    }
]






module.exports = {

    mockGoogleProfile,
    mocInitialUser,
    mockValidGuestData,
    mockValidHostData,
    mockValidCompleteUser,
    mockValidCompleteHostUser,
    mockValidCompleteGuestUser,
    mockInvalidUserData,
    mockInvalidGuestData,
    mockInvalidHostData,
    mockValidEventArray,
    mockDuplicateEventArray
}; 