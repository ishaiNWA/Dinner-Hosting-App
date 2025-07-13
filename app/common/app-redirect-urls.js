const appRedirectUrls = Object.freeze({
    // Web URLs
    WEB: {
      SUCCESS: 'http://localhost:8081/',
      ERROR: (err) => `https://example.com/auth-error?reason=${encodeURIComponent(err)}`
    },
    
    // Mobile URLs  
    MOBILE: {
      SUCCESS: 'exp://localhost:19000/--/auth/result',
      ERROR: 'exp://localhost:19000/--/auth/error'
    }
  });

  module.exports = {appRedirectUrls};