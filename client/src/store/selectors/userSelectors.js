// User selectors for easy access to user state
export const selectCurrentUser = (state) => state.user.currentUser
export const selectToken = (state) => state.user.token
export const selectIsAuthenticated = (state) => state.user.isAuthenticated
export const selectIsLoading = (state) => state.user.isLoading
export const selectUserError = (state) => state.user.error

// Derived selectors
export const selectUserRole = (state) => state.user.currentUser?.role
export const selectUserName = (state) => state.user.currentUser?.name
export const selectUserEmail = (state) => state.user.currentUser?.email
export const selectIsVerified = (state) => state.user.currentUser?.isVerified
export const selectIsProfileComplete = (state) => state.user.currentUser?.isProfileComplete
