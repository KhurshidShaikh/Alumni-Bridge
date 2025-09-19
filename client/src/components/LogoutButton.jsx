import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from '../store/slices/userSlice'
import { toast } from "sonner"

const LogoutButton = ({ variant = "ghost", size = "sm", className = "" }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      // Clear Redux state and localStorage
      dispatch(logout())
      
      // Show success message
      toast.success('Logged out successfully!')
      
      // Redirect to landing page
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error during logout')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`flex items-center space-x-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}

export default LogoutButton
