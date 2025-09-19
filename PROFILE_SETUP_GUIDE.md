# AlumniBridge Profile Management Setup Guide

## Overview
Complete user registration and profile management system with admin verification and conditional routing.

## Features Implemented

### Backend Features
- ✅ User registration with validation
- ✅ Admin verification system
- ✅ Profile update API with role-based validation
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration

### Frontend Features
- ✅ Registration form with validation
- ✅ Login with verification checks
- ✅ Redux state management
- ✅ Profile completion form using shadcn/ui
- ✅ Protected routes with conditional access
- ✅ Automatic redirect to profile completion

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```

Create `.env` file based on `.env.example`:
```env
MONGODB_URI=mongodb://localhost:27017/alumnibridge
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Start the server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the development server:
```bash
npm run dev
```

## User Flow

### 1. Registration Flow
1. User visits `/register`
2. Fills registration form (name, email, password, GR number, role)
3. Account created with `isVerified: false`
4. User receives message about pending admin verification

### 2. Login Flow
1. User visits `/login`
2. Enters credentials
3. System validates credentials first, then checks verification status
4. If verified but profile incomplete → redirects to `/profile/edit`
5. If verified and profile complete → redirects to `/home`

### 3. Profile Completion Flow
1. User lands on `/profile/edit` after login
2. Fills required fields based on role:
   - **Common**: bio, phone, location, branch, graduation year
   - **Alumni**: current company, current position
   - **Students**: batch
3. Profile saved with `isProfileComplete: true`
4. User can access main application

### 4. Protected Routes
- `/profile/edit` - Requires authentication only
- All other routes (`/home`, `/profile`, etc.) - Require complete profile
- Automatic redirects ensure proper flow

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Profile Management
- `PUT /api/profile/update` - Update user profile
- `GET /api/profile/me` - Get current user profile

## Testing the Flow

### Test User Registration
1. Go to `/register`
2. Create account with role 'student' or 'alumni'
3. Try to login → should show verification pending message

### Test Admin Verification
1. Manually set `isVerified: true` in database for test user
2. Login → should redirect to profile completion

### Test Profile Completion
1. Fill profile form with required fields
2. Submit → should redirect to home page
3. Try accessing other routes → should work normally

### Test Protected Routes
1. Try accessing `/home` without login → redirects to login
2. Try accessing `/home` with incomplete profile → redirects to profile edit
3. Complete profile → can access all routes

## File Structure

### Backend
```
server/
├── controllers/
│   ├── Authentication.js (login, register)
│   └── Profile.js (profile update, get profile)
├── models/
│   └── userModel.js (user schema with profile fields)
├── routes/
│   └── profile.js (profile routes)
└── middlewere/
    └── userAuth.js (JWT authentication)
```

### Frontend
```
client/src/
├── components/
│   └── ProtectedRoute.jsx (conditional routing)
├── pages/
│   ├── LoginPage.jsx (with profile completion check)
│   ├── RegisterPage.jsx (with validation)
│   └── ProfileEdit.jsx (profile completion form)
├── store/
│   ├── store.js (Redux store)
│   ├── slices/userSlice.js (user state management)
│   └── selectors/userSelectors.js (state selectors)
└── hooks/
    └── useAuth.js (authentication hook)
```

## Key Components

### ProtectedRoute Component
- Handles authentication checks
- Manages profile completion requirements
- Provides loading states
- Automatic redirects

### ProfileEdit Page
- Role-based conditional fields
- Form validation
- API integration
- Redux state updates

### Redux Integration
- User authentication state
- Token management
- Profile completion status
- Persistent storage

## Troubleshooting

### Common Issues
1. **CORS errors**: Check `FRONTEND_URL` in backend `.env`
2. **API connection**: Verify `VITE_BACKEND_URL` in frontend `.env`
3. **Database connection**: Ensure MongoDB is running
4. **JWT errors**: Check `JWT_SECRET` configuration

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Redux DevTools for state changes
4. Verify database records for user data

## Next Steps
- Add image upload for profile avatars
- Implement email verification
- Add profile validation on backend
- Create admin dashboard for user verification
- Add profile completion progress indicator
