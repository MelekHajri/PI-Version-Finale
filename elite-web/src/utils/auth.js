export const isTokenExpired = (token) => {
    if (!token) return true;
  
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
  
      return currentTime > expirationTime; // Token is expired if current time > expiration
    } catch (error) {
      console.error('Invalid token:', error);
      return true; // Treat invalid tokens as expired
    }
  };
