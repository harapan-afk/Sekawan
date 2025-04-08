import { jwtDecode } from 'jwt-decode';

// Interface for login credentials
interface LoginCredentials {
  username: string;
  password: string;
}

// Interface for decoded token
interface TokenPayload {
  sub: string;
  exp: number;
  username: string;
}

class AuthService {
  // Method to get token from storage
  static getToken(): string | null {
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') || 
           null;
  }

  // Private method to get token from storage
  private static getTokenFromStorage(): string | null {
    return this.getToken();
  }

  // Check if token is valid
  static isTokenValid(): boolean {
    const token = this.getTokenFromStorage();
    
    // No token means not authenticated
    if (!token) return false;

    try {
      // Decode the token
      const decoded = jwtDecode<TokenPayload>(token);
      
      // Check expiration
      // Multiply by 1000 to convert seconds to milliseconds
      const isExpired = decoded.exp * 1000 < Date.now();
      
      return !isExpired;
    } catch (error) {
      // Token is invalid or cannot be decoded
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Login method
  static async login(username: string, password: string, rememberMe: boolean): Promise<string> {
    try {
      const response = await fetch('https://api.sekawan-grup.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      // Parse response
      const data = await response.json();

      // Check if login was successful
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token
      const token = data.token;
      
      // Store in appropriate storage based on remember me
      if (rememberMe) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }

      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout method
  static async logout(): Promise<void> {
    try {
      const token = this.getTokenFromStorage();
      
      // If no token, just clear storage and redirect
      if (!token) {
        this.clearTokens();
        this.redirectToLogin();
        return;
      }

      // Attempt to call logout endpoint
      const response = await fetch('https://api.sekawan-grup.com/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      // Clear tokens regardless of response
      this.clearTokens();

      // Check if logout was successful
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Redirect to login
      this.redirectToLogin();
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      this.clearTokens();
      this.redirectToLogin();
    }
  }

  // Clear tokens from storage
  static clearTokens(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  // Redirect to login page
  static redirectToLogin(): void {
    window.location.href = '/login';
  }

  // Get user info from token
  static getUserInfo(): TokenPayload | null {
    const token = this.getTokenFromStorage();
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }
}

export default AuthService;