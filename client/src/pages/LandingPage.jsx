import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Award, 
  Globe, 
  ArrowRight,
  Star,
  Building,
  MapPin,
  Calendar,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate=useNavigate();

  // Check for existing token and redirect to home if authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is not expired or invalid by checking if it exists and is not empty
      try {
        // Basic token validation - check if it's not empty and looks like a JWT
        if (token.trim() && token.split('.').length === 3) {
          navigate('/home');
          return;
        }
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white poppins-regular">
      {/* Sticky Header Navigation with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <nav className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg' 
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl poppins-bold text-blue-600">AlumniBridge</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors poppins-medium">
                  About
                </a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors poppins-medium">
                  Features
                </a>
                <a href="#alumni" className="text-gray-700 hover:text-blue-600 transition-colors poppins-medium">
                  Alumni
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors poppins-medium">
                  Contact
                </a>
              </div>

              {/* Desktop Auth Buttons & Profile */}
              <div className="hidden md:flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg poppins-medium transition-colors"
              onClick={()=>{navigate("/login")}}
              >

                  Login
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg poppins-medium transition-colors"
                onClick={()=>{navigate("/register")}}
                >
                  Sign Up
                </button>
                
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-blue-600 transition-colors p-2"
                  aria-label="Toggle mobile menu"
                >
                  <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        <div className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className={`absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AB</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">Alumni Bridge</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Welcome back!</p>
                    <p className="font-semibold text-gray-900">Join the network</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2 mb-8">
                <a 
                  href="#about" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>About</span>
                </a>
                <a 
                  href="#features" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Features</span>
                </a>
                <a 
                  href="#alumni" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Alumni</span>
                </a>
                <a 
                  href="#contact" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact</span>
                </a>
              </nav>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium transition-all border border-gray-200"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Bottom Section */}
             
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20" id='about'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div>
                
                <h1 className="text-5xl md:text-6xl poppins-bold text-gray-900 mb-6 leading-tight">
                  Your College <span className="text-blue-600">Alumni Network</span>
                  <br />
                  <span className="text-gray-700">Starts Here</span>
                </h1>
                <p className="text-xl poppins-regular text-gray-600 mb-8 leading-relaxed max-w-2xl">
                  Connect with fellow graduates, discover career opportunities, find mentors, and give back to your alma mater. Join the most comprehensive alumni platform designed for your college community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button 
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl poppins-semibold transition-all transform hover:scale-105 flex items-center justify-center shadow-lg"
                  >
                    Join Alumni Network
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <button 
                    onClick={() => navigate("/login")}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl poppins-semibold transition-all"
                  >
                    Sign In
                  </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl poppins-bold text-gray-900 mb-1">5000+</div>
                    <div className="text-sm poppins-regular text-gray-600">Alumni Connected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl poppins-bold text-gray-900 mb-1">1200+</div>
                    <div className="text-sm poppins-regular text-gray-600">Job Placements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl poppins-bold text-gray-900 mb-1">50+</div>
                    <div className="text-sm poppins-regular text-gray-600">Countries</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - College Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Background Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl"></div>
                
                {/* Main Image Container */}
                <div className="relative bg-white rounded-3xl p-2 shadow-2xl border border-gray-100">
                  {/* College Image Placeholder */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
                    <img 
                      src="https://dmce.ac.in/wp-content/uploads/2025/05/about-image.png" 
                      alt="College Campus" 
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback when image fails to load */}
                    <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                      <div className="text-center">
                        <Building className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-600 mb-2">Your College</h3>
                        <p className="text-sm text-gray-600">Campus Image Placeholder</p>
                      </div>
                    </div>
                    
                    {/* Overlay Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-800">Alumni Network</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Stats Cards */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-800">5K+ Alumni</span>
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white" id='alumni'>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Alumni</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet some of our most successful graduates who are making a difference in their industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Alumni 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">DR</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Raj Sharma </h3>
                <p className="text-blue-600 font-semibold mb-2">Class of 2010</p>
                <p className="text-gray-600 text-sm mb-3">Chief Technology Officer</p>
                <p className="text-gray-800 font-medium">Microsoft</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">AI/ML</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Leadership</span>
                </div>
              </div>
            </div>

            {/* Alumni 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">JK</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Jayesh kulkarni</h3>
                <p className="text-blue-600 font-semibold mb-2">Class of 2012</p>
                <p className="text-gray-600 text-sm mb-3">Investment Director</p>
                <p className="text-gray-800 font-medium">Goldman Sachs</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Finance</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Strategy</span>
                </div>
              </div>
            </div>

            {/* Alumni 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">AK</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Aisha Khan</h3>
                <p className="text-blue-600 font-semibold mb-2">Class of 2008</p>
                <p className="text-gray-600 text-sm mb-3">Head of Research</p>
                <p className="text-gray-800 font-medium">Johns Hopkins</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Medicine</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Research</span>
                </div>
              </div>
            </div>

            {/* Alumni 4 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">SK</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sakshi Patil</h3>
                <p className="text-blue-600 font-semibold mb-2">Class of 2014</p>
                <p className="text-gray-600 text-sm mb-3">Founder & CEO</p>
                <p className="text-gray-800 font-medium">EcoTech Solutions</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Startup</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Sustainability</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  navigate('/alumni');
                } else {
                  navigate('/login');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              View All Alumni
            </button>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" id="features">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for <span className="text-blue-600">Alumni Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to connect, grow, and succeed with your college alumni community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Networking Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Alumni Directory</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect with thousands of alumni across different batches, departments, and industries worldwide.
              </p>
            </div>

            {/* Job Board Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Job Opportunities</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access exclusive job postings, internships, and career opportunities shared by fellow alumni.
              </p>
            </div>

            {/* Mentorship Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">News & Stories</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Find experienced mentors or become one yourself. Guide the next generation of graduates.
              </p>
            </div>

            {/* Events Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Events & Reunions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay updated with college events, alumni meetups, and networking sessions in your area.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Built for Your College Community</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Verified Alumni Network</h4>
                    <p className="text-gray-600 text-sm">Connect only with verified graduates from your college</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Messaging</h4>
                    <p className="text-gray-600 text-sm">Instant communication with your professional network</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Success Stories</h4>
                    <p className="text-gray-600 text-sm">Share achievements and inspire fellow alumni</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Global Reach</h4>
                    <p className="text-gray-600 text-sm">Connect with alumni across 50+ countries worldwide</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Start Connecting Today</h4>
                  <p className="text-gray-600 mb-6">Join thousands of alumni who are already building their careers through meaningful connections.</p>
                  <button 
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    Create Your Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Success Stories from Our Alumni</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              See how our platform has helped graduates advance their careers and build meaningful connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-800 font-bold text-lg">PP</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Priya Patel</h4>
                  <p className="text-gray-700">Class of 2018 • Software Engineer at Google</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">
                "Through Alumni Bridge, I connected with a mentor who helped me land my dream job at Google. The network
                opened doors I never knew existed."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-800 font-bold text-lg">AM</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Arjun Mehta</h4>
                  <p className="text-gray-700">Class of 2015 • Marketing Director at Tesla</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">
                "The alumni network helped me transition from finance to tech marketing. The connections and advice I
                received were invaluable to my career pivot."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-800 font-bold text-lg">ND</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Neha Desai</h4>
                  <p className="text-gray-700">Class of 2020 • Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">
                "I found my co-founder and first investors through the alumni network. Our shared college experience
                created an instant bond and trust."
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-blue-200">Active Alumni</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1,200+</div>
              <div className="text-blue-200">Job Placements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">800+</div>
              <div className="text-blue-200">Mentorship Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Connect with Your Alumni Network?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of graduates who are already building their careers through meaningful alumni connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Create Your Profile
              </button>
              <button 
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    navigate('/alumni');
                  } else {
                    navigate('/login');
                  }
                }}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Browse Alumni Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">Datta Meghe College of Engineering, Airoli</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@alumnibridge.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <p className="text-gray-600">www.alumnibridge.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Join the Network
                  </button>
                  <button 
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        navigate('/alumni');
                      } else {
                        navigate('/login');
                      }
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Browse Alumni
                  </button>
                  <button 
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        navigate('/jobs');
                      } else {
                        navigate('/login');
                      }
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Explore Jobs
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Ready to join the network?</p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AlumniBridge</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The premier alumni networking platform connecting graduates worldwide. Build meaningful professional relationships and accelerate your career growth.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-xs text-gray-400">Alumni</div>
                </div>
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-xs text-gray-400">Countries</div>
                </div>
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-white">1K+</div>
                  <div className="text-xs text-gray-400">Jobs Posted</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        navigate('/alumni');
                      } else {
                        navigate('/login');
                      }
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Find Alumni
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        navigate('/news-stories');
                      } else {
                        navigate('/login');
                      }
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    News & Stories
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        navigate('/jobs');
                      } else {
                        navigate('/login');
                      }
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Job Board
                  </button>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Alumni Bridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;