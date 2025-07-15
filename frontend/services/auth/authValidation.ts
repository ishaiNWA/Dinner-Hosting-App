import { User } from "@/types/auth";

export function validateMobileAuthResult(params: any) {
    // Validate required parameters exist
    if (!params || !params.token || !params.user || params.isRegistrationComplete === undefined) {
        return { error: 'Invalid Mobile OAuth response - missing required parameters' };
    }
    
    // Parse and return the expected structure
    return {
        token: params.token as string,
        user: JSON.parse(decodeURIComponent(params.user as string)) as User,
        isRegistrationComplete: params.isRegistrationComplete === 'true'
    };
}

export function validateWebAuthResult(result: any) {   
    console.log("VALDATION FOR WEB AUTH RESULT!!", JSON.stringify(result));
    if (!result || !result.user || result.isRegistrationComplete === undefined) {
        return { error: 'Invalid Web OAuth response - missing required parameters' };
    } else {
        return {
            user: result.user,
            isRegistrationComplete: result.isRegistrationComplete
        }
    }
} 