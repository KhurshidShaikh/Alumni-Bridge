import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate=useNavigate();

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
                <span className="text-xl poppins-medium text-blue-600">Alumni Bridge</span>
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
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </button>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </button>
              </div>

              {/* Bottom Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Connect with 5,000+ alumni worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl poppins-bold text-gray-900 mb-6 leading-tight">
                  Connect. <span className="text-blue-600">Grow.</span>
                  <br />
                  Succeed.
                </h1>
                <p className="text-lg poppins-regular text-gray-600 mb-8 leading-relaxed max-w-lg">
                  Join the premier networking platform for DMCE alumni. Connect with fellow graduates, find mentorship opportunities, and accelerate your career growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg poppins-semibold transition-colors flex items-center justify-center">
                    Join Alumni Network
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg poppins-semibold transition-colors">
                    Explore Success Stories
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

            {/* Right Column - Illustration */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full transform rotate-6"></div>
                
                {/* Main Content */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
                  <div className="text-center mb-8">
                    {/* Graduation Cap Icon */}
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-xl poppins-bold text-blue-600 mb-2">DMCE Campus</h3>
                    <p className="text-sm poppins-regular text-gray-600 mb-6">Graduation Ceremony</p>
                  </div>

                  {/* Network Icon */}
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="text-center">
                    <p className="text-xs poppins-regular text-gray-500">Made with</p>
                    <p className="text-sm poppins-semibold text-gray-700">Emergent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Rachel Martinez</h3>
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
                  <span className="text-white font-bold text-2xl">JT</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">James Thompson</h3>
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
                  <span className="text-white font-bold text-2xl">AL</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Aisha Lee</h3>
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
                  <span className="text-white font-bold text-2xl">MK</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Maria Kim</h3>
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
              View All Alumni
            </button>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Join Your Alumni Network?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock exclusive opportunities and connections that only your college community can provide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mentorship Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Expert Mentorship</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Connect with successful alumni from your college who can guide your career path and share valuable
                industry insights.
              </p>
            </div>

            {/* Job Connections Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Career Opportunities</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Access exclusive job openings and internships shared by alumni working at top companies in your field.
              </p>
            </div>

            {/* Professional Network Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Lifelong Network</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Build meaningful professional relationships with fellow graduates who share your college experience and
                values.
              </p>
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
                  <span className="text-gray-800 font-bold text-lg">SJ</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Sarah Johnson</h4>
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
                  <span className="text-gray-800 font-bold text-lg">MC</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Michael Chen</h4>
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
                  <span className="text-gray-800 font-bold text-lg">EP</span>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Emily Parker</h4>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Create Your Profile
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
                Browse Alumni Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AB</span>
                </div>
                <span className="text-lg font-bold">Alumni Bridge</span>
              </div>
              <p className="text-gray-400">
                Connecting college graduates for career success and lifelong relationships.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Alumni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mentorship
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Job Board
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Events
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