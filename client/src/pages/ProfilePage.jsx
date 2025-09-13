import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  Edit, 
  Award, 
  Briefcase, 
  GraduationCap,
  Camera,
  Building
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Mock user profile data
  const userProfile = {
    name: "John Doe",
    role: "Student",
    batch: "2024",
    grNumber: "GR202400123",
    department: "Computer Science",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "/api/placeholder/120/120",
    bio: "Passionate computer science student interested in full-stack development and machine learning. Currently working on several projects including a web application for student collaboration and an AI-powered study assistant.",
    skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning", "SQL", "Git", "AWS"],
    interests: ["Web Development", "AI/ML", "Open Source", "Startups", "Photography"],
    socialLinks: {
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      website: "johndoe.dev"
    },
    education: {
      university: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      gpa: "3.8/4.0",
      expectedGraduation: "May 2024"
    },
    experience: [
      {
        title: "Software Engineering Intern",
        company: "TechCorp Inc.",
        duration: "Jun 2023 - Aug 2023",
        description: "Developed REST APIs using Node.js and worked on frontend components with React."
      },
      {
        title: "Teaching Assistant",
        company: "University of Technology",
        duration: "Sep 2023 - Present",
        description: "Assisting in Data Structures and Algorithms course, helping students with programming assignments."
      }
    ],
    projects: [
      {
        name: "Alumni Connect Platform",
        description: "A web platform connecting students with alumni for mentorship and networking.",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        link: "github.com/johndoe/alumni-connect"
      },
      {
        name: "AI Study Assistant",
        description: "Machine learning model that helps students with personalized study recommendations.",
        technologies: ["Python", "TensorFlow", "Flask", "React"],
        link: "github.com/johndoe/ai-study-assistant"
      }
    ],
    achievements: [
      "Dean's List - Fall 2023",
      "Hackathon Winner - TechFest 2023",
      "Academic Excellence Award - 2022"
    ],
    mentorshipStats: {
      mentorRating: 4.7,
      mentorReviews: 12,
      menteesHelped: 8,
      sessionsCompleted: 24
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center mb-6">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-4">
                        <AvatarImage src="/api/placeholder/150/150" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl md:text-2xl font-semibold">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 poppins-medium">John Doe</h2>
                      <p className="text-sm md:text-base text-gray-600">Software Engineer</p>
                      <p className="text-xs md:text-sm text-gray-500">Class of 2020</p>
                    </div>
                    <div className="mb-6 md:mb-8">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                      <p className="text-sm md:text-base text-gray-600">Manage your profile information and settings</p>
                    </div>
                    <Badge variant="secondary">{userProfile.role}</Badge>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      Batch {userProfile.batch}
                    </div>
                  </div>
                  <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-6">{userProfile.bio}</p>
                
                <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
                  <Button variant="outline" className="w-full md:w-auto">
                    Cancel
                  </Button>
                  <Button className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4">
                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4 mr-2" />
                          View Project
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">{userProfile.education.degree}</h3>
                    <p className="text-blue-600">{userProfile.education.university}</p>
                    <div className="text-sm text-gray-600">
                      <p>GPA: {userProfile.education.gpa}</p>
                      <p>Expected Graduation: {userProfile.education.expectedGraduation}</p>
                      <p>GR Number: {userProfile.grNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mentorship Stats (if applicable) */}
              {userProfile.role === 'Alumni' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mentorship Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{userProfile.mentorshipStats.mentorRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reviews</span>
                        <span className="font-medium">{userProfile.mentorshipStats.mentorReviews}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mentees Helped</span>
                        <span className="font-medium">{userProfile.mentorshipStats.menteesHelped}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sessions</span>
                        <span className="font-medium">{userProfile.mentorshipStats.sessionsCompleted}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{userProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{userProfile.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
