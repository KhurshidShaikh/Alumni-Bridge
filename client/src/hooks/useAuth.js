import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserFromStorage } from '../store/slices/userSlice'
import { selectCurrentUser, selectIsAuthenticated, selectToken } from '../store/selectors/userSelectors'

export const useAuth = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectToken)

  useEffect(() => {
    // Load user from localStorage on app initialization
    if (!isAuthenticated && !currentUser) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, isAuthenticated, currentUser])

  return {
    currentUser,
    isAuthenticated,
    token,
  }
}
