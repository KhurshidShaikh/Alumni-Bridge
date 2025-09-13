import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, toast } from "sonner"
import { Eye, EyeOff, GraduationCap, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

 function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Input validation
    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (!password) {
      toast.error("Please enter your password.")
      return
    }

    setIsLoading(true)

    try {
      // Make API call to login endpoint
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        toast.success(`Welcome back to Alumni Bridge, ${data.user.name}!`)
        
        // Navigate to home page after successful login
        setTimeout(() => {
          navigate('/home')
        }, 1500)
      } else {
        // Handle specific error cases
        if (response.status === 403) {
          toast.error(
            "🔒Account Not Verified\n\nYour account is pending admin verification. You will receive a notification once your account is approved",
            {
              duration: 6000,
              style: {
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                color: '#92400E'
              }
            }
          )
        } else {
          toast.error("Invalid credentials. Please check your email and password and try again.")
        }
      }
    } catch (error) {
      console.error('Login error:', error)
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
                <GraduationCap className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Sign in to your Alumni Bridge account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">

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
                      placeholder="Enter your password"
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
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  Forgot your password?
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Don't have an account?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-all bg-transparent"
                onClick={() => {
                  toast.info("Taking you to the registration page.")
                  navigate("/register")
                }}
              >
                Create New Account
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
export default LoginPage;