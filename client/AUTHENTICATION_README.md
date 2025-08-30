# Authentication Implementation

This document describes the complete authentication system implemented in the frontend that integrates with the server's authentication API.

## Overview

The authentication system provides:
- User registration with full profile data
- User login with JWT token authentication
- Profile management and updates
- Token verification and persistence
- Centralized API utilities

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Main authentication context
├── utils/
│   └── api.js                   # Centralized API utilities
├── pages/
│   ├── Login.jsx                # Login/Register page
│   └── Profile.jsx              # User profile page
└── components/
    └── common/
        ├── UserProfile.jsx      # User dropdown component
        └── AuthTest.jsx         # Authentication testing component
```

## API Endpoints

The frontend integrates with these server endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/init-admin` - Initialize admin user

## User Data Structure

Based on the server's User schema:

```javascript
{
  id: String,
  name: String,
  email: String,
  role: "community_member" | "admin",
  points: Number,
  badges: [String],
  carbonCredits: {
    earned: Number,
    sold: Number
  },
  organization: String,
  location: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### 1. Authentication Context

The `AuthContext` provides authentication state and methods:

```javascript
import { useAuth } from '../context/AuthContext';

const { 
  user,           // Current user object
  token,          // JWT token
  loading,        // Loading state
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  updateProfile,  // Update profile function
  getProfile,     // Get profile function
  isAuthenticated // Boolean authentication status
} = useAuth();
```

### 2. User Registration

```javascript
const result = await register(
  name,           // Required
  email,          // Required
  password,       // Required
  phone,          // Required
  location,       // Required
  organization    // Optional
);

if (result.success) {
  // User registered successfully
  console.log(result.user);
} else {
  // Registration failed
  console.error(result.error);
}
```

### 3. User Login

```javascript
const result = await login(email, password);

if (result.success) {
  // Login successful
  console.log(result.user);
} else {
  // Login failed
  console.error(result.error);
}
```

### 4. Profile Management

```javascript
// Get current profile
const result = await getProfile();

// Update profile
const updateResult = await updateProfile({
  name: "New Name",
  phone: "+1234567890",
  location: "New Location"
});
```

### 5. API Utilities

The centralized API utilities provide consistent error handling:

```javascript
import { authAPI, userAPI } from '../utils/api';

// Direct API calls
const result = await authAPI.login({ email, password });
const profile = await authAPI.getProfile(token);
```

## Features

### 1. Token Persistence
- JWT tokens are stored in localStorage
- Automatic token verification on app load
- Automatic logout on token expiration

### 2. Form Validation
- Required field validation
- Email format validation
- Password strength requirements

### 3. Error Handling
- Centralized error handling in API utilities
- User-friendly error messages
- Network error handling

### 4. Loading States
- Loading indicators during API calls
- Disabled buttons during operations
- Skeleton loading for profile data

### 5. Responsive Design
- Mobile-friendly forms
- Dark/light theme support
- Consistent styling with the app theme

## Security Features

1. **JWT Token Authentication**: Secure token-based authentication
2. **Password Hashing**: Passwords are hashed on the server side
3. **Token Expiration**: Tokens expire after 1 day
4. **Automatic Logout**: Invalid tokens trigger automatic logout
5. **CORS Protection**: Server-side CORS configuration

## Testing

Use the `AuthTest` component to verify authentication functionality:

```javascript
import AuthTest from './components/common/AuthTest';

// Add to any page for testing
<AuthTest />
```

The test component will:
- Check server connectivity
- Test admin initialization
- Test user registration
- Test user login
- Test profile fetching

## Configuration

### API Base URL

The API base URL is configured in `src/utils/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8000/api";
```

Update this URL for different environments (development, staging, production).

### CORS Configuration

The server CORS configuration allows localhost origins:

```javascript
const corsConfig = {
  origin: /http:\/\/localhost:\d+$/,
  credentials: true
};
```

## Error Handling

Common error scenarios and their handling:

1. **Network Errors**: Display user-friendly error messages
2. **Invalid Credentials**: Show specific login/registration errors
3. **Token Expiration**: Automatic logout and redirect to login
4. **Server Errors**: Graceful degradation with error messages

## Future Enhancements

1. **Password Reset**: Implement password reset functionality
2. **Email Verification**: Add email verification for new accounts
3. **Social Login**: Integrate OAuth providers
4. **Two-Factor Authentication**: Add 2FA support
5. **Session Management**: Multiple device session handling

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure server is running and CORS is configured
2. **Token Issues**: Clear localStorage and re-login
3. **Network Errors**: Check server connectivity and API endpoints
4. **Validation Errors**: Ensure all required fields are filled

### Debug Mode

Enable debug logging by checking browser console for detailed error messages and API call logs.

## Dependencies

- React Context API for state management
- Fetch API for HTTP requests
- LocalStorage for token persistence
- React Router for navigation
- Tailwind CSS for styling
