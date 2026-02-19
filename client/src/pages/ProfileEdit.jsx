import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Toaster, toast } from "sonner"
import { User, Building, MapPin, Phone, Globe, Github, Linkedin, FileText, GraduationCap, Camera, Upload } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { selectCurrentUser, selectToken } from "../store/selectors/userSelectors"
import { updateUser } from "../store/slices/userSlice"

function ProfileEdit() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const token = useSelector(selectToken)
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    location: "",
    branch: "",
    currentCompany: "",
    currentPosition: "",
    profileUrl: "",
    grNo: ""
  })

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true)

        const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
        const response = await fetch(`${backendUrl}/api/profile/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.user) {
          const user = data.user

          // Determine if this is edit mode
          setIsEditMode(user._id === id || user.id === id)

          // Populate form with fetched data
          setFormData({
            bio: user.profile?.bio || "",
            phone: user.profile?.phone || "",
            linkedin: user.profile?.linkedin || "",
            github: user.profile?.github || "",
            website: user.profile?.website || "",
            location: user.profile?.location || "",
            branch: user.profile?.branch || "",
            currentCompany: user.profile?.currentCompany || "",
            currentPosition: user.profile?.currentPosition || "",
            profileUrl: user.profile?.profileUrl || "",
            grNo: user.grNo || ""
          })
          setProfileImageUrl(user.profile?.profileUrl || "")
        }
      } catch (error) {
        console.error('Profile fetch error:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (token && id) {
      fetchUserProfile()
    } else {
      setIsLoadingProfile(false)
    }
  }, [token, id])

  // Fallback to Redux state if API fails
  useEffect(() => {
    if (!isLoadingProfile && currentUser && (!formData.bio && !formData.phone)) {
      setFormData({
        bio: currentUser.profile?.bio || "",
        phone: currentUser.profile?.phone || "",
        linkedin: currentUser.profile?.linkedin || "",
        github: currentUser.profile?.github || "",
        website: currentUser.profile?.website || "",
        location: currentUser.profile?.location || "",
        branch: currentUser.profile?.branch || "",
        currentCompany: currentUser.profile?.currentCompany || "",
        currentPosition: currentUser.profile?.currentPosition || "",
        profileUrl: currentUser.profile?.profileUrl || "",
        grNo: currentUser.grNo || ""
      })
      setProfileImageUrl(currentUser.profile?.profileUrl || "")
    }
  }, [currentUser, isLoadingProfile, formData.bio, formData.phone])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('profileImage', file)

      const backendUrl2 = import.meta.env.VITE_BACKEND_URL ?? '';
      const response = await fetch(`${backendUrl2}/api/upload/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload response error:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setProfileImageUrl(data.imageUrl)
        handleInputChange('profileUrl', data.imageUrl)
        toast.success('Profile image uploaded successfully!')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const validateForm = () => {
    const errors = []

    if (!formData.bio.trim()) {
      errors.push("Bio is required")
    }

    if (!formData.phone.trim()) {
      errors.push("Phone number is required")
    }

    if (!formData.location.trim()) {
      errors.push("Location is required")
    }

    if (!formData.branch.trim()) {
      errors.push("Branch is required")
    }

    // Alumni specific validations
    if (currentUser?.role === 'alumni') {
      if (!formData.currentCompany.trim()) {
        errors.push("Current company is required for alumni")
      }
      if (!formData.currentPosition.trim()) {
        errors.push("Current position is required for alumni")
      }
    }


    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      toast.error(errors.join(", "))
      return
    }

    setIsLoading(true)

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''
      const response = await fetch(`${backendUrl}/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: formData
        })
      })

      const data = await response.json()
      console.log('Profile update response:', { status: response.status, data })

      if (data.success) {
        // Update Redux state with the updated user data
        dispatch(updateUser(data.user))

        toast.success(isEditMode ? 'Profile updated successfully!' : 'Profile completed successfully!')

        // Redirect to home page after successful profile completion
        setTimeout(() => {
          navigate('/home')
        }, 1500)
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? 'Update your profile information to keep it current'
              : 'Help others connect with you by completing your profile information'
            }
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Fill in your details to complete your Alumni Bridge profile
            </CardDescription>

            {/* Profile Image Upload Section */}
            <div className="flex flex-col items-center space-y-4 mt-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-blue-200">
                  <AvatarImage src={profileImageUrl} alt="Profile" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                      {isUploadingImage ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Click the camera icon to upload a profile picture
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                  Bio *
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Branch *
                  </Label>
                  <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                    <SelectTrigger id="branch">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Chemical">Chemical</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>



                <div className="space-y-2">
                  <Label htmlFor="grNo" className="text-sm font-semibold text-gray-700">
                    GR Number
                  </Label>
                  <Input
                    id="grNo"
                    placeholder="Enter GR number (optional)"
                    value={formData.grNo}
                    onChange={(e) => handleInputChange('grNo', e.target.value)}
                  />
                </div>
              </div>

              {/* Professional Information (Alumni only) */}
              {currentUser.role === 'alumni' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentCompany" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      Current Company *
                    </Label>
                    <Input
                      id="currentCompany"
                      placeholder="Enter your current company"
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPosition" className="text-sm font-semibold text-gray-700">
                      Current Position *
                    </Label>
                    <Input
                      id="currentPosition"
                      placeholder="Enter your current position"
                      value={formData.currentPosition}
                      onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="LinkedIn profile URL"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    placeholder="GitHub profile URL"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="Personal website URL"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    isEditMode ? "Update Profile" : "Complete Profile"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default ProfileEdit
