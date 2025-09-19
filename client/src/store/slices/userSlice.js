import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.currentUser = action.payload.user
      state.token = action.payload.token
      state.error = null
      
      // Save to localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.currentUser = null
      state.token = null
      state.error = action.payload
    },
    logout: (state) => {
      state.currentUser = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        try {
          state.token = token
          state.currentUser = JSON.parse(user)
          state.isAuthenticated = true
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    },
    updateUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.currentUser))
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  loadUserFromStorage,
  updateUser,
  clearError
} = userSlice.actions

export default userSlice.reducer
