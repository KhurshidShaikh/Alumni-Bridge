import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, UserPlus, Users } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from "sonner"
import { loadUserFromStorage } from '../store/slices/userSlice'
import { selectIsAuthenticated, selectCurrentUser } from '../store/selectors/userSelectors'

function RegisterPage() {
  const [name, setName] = useState("")
  const [userType, setUserType] = useState("")
  const [grNo, setGrNo] = useState("")
  const [batch, setBatch] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    // Load user from storage if not already loaded
    if (!isAuthenticated && !currentUser) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, isAuthenticated, currentUser])

  useEffect(() => {
    // If user is authenticated, redirect based on profile completion
    if (isAuthenticated && currentUser) {
      if (!currentUser.isProfileComplete) {
        navigate(`/profile/edit/${currentUser._id || currentUser.id}`)
      } else {
        navigate('/home')
      }
    }
  }, [isAuthenticated, currentUser, navigate])

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const validateGrNo = (grNo) => {
    return grNo.trim().length > 0
  }

  const validateName = (name) => {
    return name.trim().length >= 2 && name.trim().length <= 100
  }

  const validateBatch = (batch) => {
    const year = parseInt(batch)
    const currentYear = new Date().getFullYear()
    return year >= 1900 && year <= currentYear + 10 // Allow future graduation years
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Enhanced validation
    if (!name.trim()) {
      toast.error("Please enter your full name.")
      return
    }

    if (!validateName(name)) {
      toast.error("Name must be between 2 and 100 characters long.")
      return
    }

    if (!userType) {
      toast.error("Please select whether you are an Alumni or Student.")
      return
    }

    if (!grNo || !validateGrNo(grNo)) {
      toast.error("Please enter your GR Number.")
      return
    }

    if (!batch || !validateBatch(batch)) {
      toast.error("Please enter a valid batch year (graduation year).")
      return
    }

    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (!password || !validatePassword(password)) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)

    try {
      // Make API call to register endpoint
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          role: userType,
          GrNo: grNo.trim(),
          batch: parseInt(batch)
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || 'Registration successful! Your account is pending admin verification.')
        // Clear form
        setName('')
        setEmail('')
        setPassword('')
        setUserType('')
        setGrNo('')
        setBatch('')
        // Navigate to login after successful registration
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        toast.error(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AB</span>
          </div>
          <span className="text-xl font-semibold text-blue-600">Alumni Bridge</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          {/* Glass morphism card */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Join Alumni Bridge</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Create your account to connect with alumni
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/50 border-white/30 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>

                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    I am a
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={userType === "alumni" ? "default" : "outline"}
                      className={`h-12 flex items-center justify-center space-x-2 transition-all ${
                        userType === "alumni" 
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg" 
                          : "bg-white/50 border-white/30 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => setUserType("alumni")}
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Alumni</span>
                    </Button>
                    <Button
                      type="button"
                      variant={userType === "student" ? "default" : "outline"}
                      className={`h-12 flex items-center justify-center space-x-2 transition-all ${
                        userType === "student" 
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg" 
                          : "bg-white/50 border-white/30 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => setUserType("student")}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-medium">Student</span>
                    </Button>
                  </div>
                </div>

                {/* GR Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="grNo" className="text-sm font-semibold text-gray-700">
                    GR Number
                  </Label>
                  <Input
                    id="grNo"
                    type="text"
                    placeholder="Enter your GR number"
                    value={grNo}
                    onChange={(e) => setGrNo(e.target.value.trim())}
                    className="bg-white/50 border-white/30 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Batch Year Input */}
                <div className="space-y-2">
                  <Label htmlFor="batch" className="text-sm font-semibold text-gray-700">
                    Batch Year (Graduation Year)
                  </Label>
                  <Input
                    id="batch"
                    type="number"
                    placeholder="Enter your graduation year (e.g., 2024)"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="bg-white/50 border-white/30 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                    min="1900"
                    max="2050"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    className="bg-white/50 border-white/30 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50 border-white/30 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-all bg-transparent"
                onClick={() => {
                  toast.info("Taking you to the login page.")
                  navigate("/login")
                }}
              >
                Sign In Instead
              </Button>
            </CardContent>
          </Card>

          {/* Bottom Text */}
          <div className="text-center mt-8">
          
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default RegisterPage
