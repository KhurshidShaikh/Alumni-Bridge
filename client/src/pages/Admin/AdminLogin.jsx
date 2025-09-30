import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Shield, GraduationCap } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from "sonner"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
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
      // Make API call to admin login endpoint
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/admin/login`, {
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
        // Store admin token and data
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminData', JSON.stringify(data.admin))
        
        toast.success(`Welcome to Admin Panel, ${data.admin.name}!`)
        
        // Navigate to admin dashboard
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
      } else {
        toast.error(data.error || "Invalid admin credentials. Please check your email and password.")
      }
    } catch (error) {
      console.error('Admin login error:', error)
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AB</span>
            </div>
            <span className="text-xl font-semibold text-blue-600">Alumni Bridge</span>
          </div>
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            User Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          {/* Glass morphism card */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Admin Portal</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Sign in to manage Alumni Bridge platform
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Admin Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
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
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Access Admin Panel</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Secure Admin Access</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This portal is restricted to authorized administrators only. 
                      All login attempts are monitored and logged.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Main Site */}
              <div className="text-center">
                <Link 
                  to="/" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors inline-flex items-center space-x-1"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Back to Alumni Bridge</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Text */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              © 2024 Alumni Bridge. Admin Portal v1.0
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default AdminLogin;