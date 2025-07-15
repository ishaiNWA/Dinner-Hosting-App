import { Platform } from "react-native";
import { Config } from "@/constants/Config";

const ALLOWED_ORIGINS = [
    'http://localhost:8081',
    Config.API_URL,
];

export async function handleWebGoogleLogin() {
    // Return a Promise so we can await this function
    return new Promise((resolve, reject) => {
      let isAuthSuccess = false;
      let isCleanedUp = false;
  
      let googleLoginPopup: any;
     // 1. OPEN THE POPUP

     setTimeout(() => {
     googleLoginPopup = window.open(
         `${Config.OAUTH_LOGIN_URL}?platform=${Platform.OS}&origin=${encodeURIComponent(window.location.origin)}`, // Your existing server URL!
         'googleLogin', // Internal name for this popup
         'width=500,height=600,scrollbars=yes,resizable=yes,location=yes'
     );

     //  CHECK IF POPUP WAS BLOCKED
     if (!googleLoginPopup ) {
     console.error("Popup was blocked by browser");
     reject(new Error('Popup blocked by browser. Please allow popups for this site.'));
     return;
     }
 }, 100)//delay 100ms to ensure listener is ready
       
       //  LISTENER FOR MESSAGES FROM POPUP
       const messageHandler = (event: any) => {
         console.log("Received message from popup:", event.data);
         // Security check - only accept messages from our own domain
         if (!ALLOWED_ORIGINS.includes(event.origin)) {
           console.warn("Ignoring message from unknown origin:", event.origin);
           return;
         }
         // Check if this is our auth completion message
         if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
           isAuthSuccess = true;
           cleanup();
           resolve(event.data.result); // This is like returning success
         } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
           cleanup();
           console.error("Login failed:", event.data.error);
           reject(new Error(event.data.error)); // This is like throwing an error
         }
       };

      // START LISTENING FOR MESSAGES
      window.addEventListener('message', messageHandler);
  
      //  TIMEOUT HANDLER
      const timeoutId = setTimeout(() => {   
        if(!isAuthSuccess){
            console.log("Web Auth Timed out");
            cleanup();
            reject(new Error('Web Auth Timed out'));
        }
      }, 30000); // 30 seconds timeout
      

      //  CLEANUP FUNCTION
      const cleanup = () => {
        if(isCleanedUp) return;
        isCleanedUp = true;
        // Stop listening for messages
        window.removeEventListener('message', messageHandler);
        clearTimeout(timeoutId);
        // Close popup if still open
        if (googleLoginPopup) {
          googleLoginPopup.close();
        }
      };
  
    });
  } 