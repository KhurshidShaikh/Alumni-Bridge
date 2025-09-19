import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectIsAuthenticated, selectCurrentUser } from '../store/selectors/userSelectors'
import { loadUserFromStorage } from '../store/slices/userSlice'

function ProtectedRoute({ children, requireProfileComplete = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    // Load user from storage if not authenticated
    if (!isAuthenticated) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !currentUser) {
      navigate('/login')
      return
    }

    // Check profile completion if required
    if (requireProfileComplete && !currentUser.isProfileComplete) {
      navigate('/profile/edit')
      return
    }

    // Redirect to profile edit if profile is incomplete (except for profile edit page)
    if (!requireProfileComplete && !currentUser.isProfileComplete && !window.location.pathname.startsWith('/profile/edit')) {
      navigate(`/profile/edit/${currentUser._id || currentUser.id}`)
      return
    }
  }, [isAuthenticated, currentUser, navigate, requireProfileComplete])

  // Show loading while checking authentication
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
