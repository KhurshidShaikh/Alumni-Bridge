import { userModel } from '../models/userModel.js';
import { Announcement } from '../models/Announcement.js';
import { AdminLog } from '../models/adminLogModel.js';
import { BulkImport } from '../models/bulkImportModel.js';
import { SystemSettings } from '../models/systemSettingsModel.js';
import { EventModel as eventModel } from '../models/Event.js';
import { Job as jobModel } from '../models/jobModel.js';
import { Post as postModel } from '../models/postModel.js';
import { Connection, ConnectionRequest } from '../models/connectionModel.js';
import { Conversation, Message } from '../models/messageModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { sendBulkWelcomeEmails, generateSecurePassword } from '../services/emailService.js';

// Helper function to log admin actions
const logAdminAction = async (adminId, action, targetType, targetId, details, metadata = {}, req = null) => {
    try {
        const logData = {
            admin: adminId,
            action,
            targetType,
            details,
            metadata
        };

        if (targetId) logData.targetId = targetId;
        if (req) {
            logData.ipAddress = req.ip || req.connection.remoteAddress;
            logData.userAgent = req.get('User-Agent');
        }

        await AdminLog.create(logData);
    } catch (error) {
        console.error('Error logging admin action:', error);
    }
};

// ============= AUTHENTICATION =============

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        // Find admin user
        const admin = await userModel.findOne({ 
            email: email.toLowerCase().trim(),
            role: 'admin'
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                error: "Invalid admin credentials"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid admin credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id, 
                role: admin.role,
                email: admin.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log admin login
        await logAdminAction(admin._id, 'login', 'system', null, 'Admin logged in', {}, req);

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                profile: admin.profile
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// ============= DASHBOARD ANALYTICS =============

export const getDashboardStats = async (req, res) => {
    try {
        const adminId = req.adminId.id;

        // Get basic counts
        const totalUsers = await userModel.countDocuments();
        const totalStudents = await userModel.countDocuments({ role: 'student' });
        const totalAlumni = await userModel.countDocuments({ role: 'alumni' });
        const pendingVerifications = await userModel.countDocuments({ isVerified: false });
        const totalJobs = await jobModel.countDocuments();
        const totalEvents = await eventModel.countDocuments();
        const totalPosts = await postModel.countDocuments();
        const totalAnnouncements = await Announcement.countDocuments({ isActive: true });

        // Get recent activities
        const recentUsers = await userModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role isVerified createdAt');

        const recentLogs = await AdminLog.find()
            .populate('admin', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get user registration trends (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const registrationTrends = await userModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        role: "$role"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.date": 1 }
            }
        ]);

        // Get department-wise statistics
        const departmentStats = await userModel.aggregate([
            {
                $match: {
                    "profile.branch": { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$profile.branch",
                    total: { $sum: 1 },
                    students: {
                        $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] }
                    },
                    alumni: {
                        $sum: { $cond: [{ $eq: ["$role", "alumni"] }, 1, 0] }
                    },
                    verified: {
                        $sum: { $cond: ["$isVerified", 1, 0] }
                    }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalStudents,
                    totalAlumni,
                    pendingVerifications,
                    totalJobs,
                    totalEvents,
                    totalPosts,
                    totalAnnouncements
                },
                recentUsers,
                recentLogs,
                registrationTrends,
                departmentStats
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch dashboard statistics"
        });
    }
};

// ============= COMPREHENSIVE ANALYTICS =============

export const getAnalytics = async (req, res) => {
    try {
        const { timeRange = '30d' } = req.query;
        
        // Calculate date ranges based on timeRange
        const now = new Date();
        let startDate, previousStartDate;
        
        switch (timeRange) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
                break;
            default: // 30d
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        }

        // ============= OVERVIEW STATISTICS =============
        
        // Total counts
        const totalUsers = await userModel.countDocuments();
        const totalAlumni = await userModel.countDocuments({ role: 'alumni' });
        const totalStudents = await userModel.countDocuments({ role: 'student' });
        const totalJobs = await jobModel.countDocuments();
        const totalConnections = await Connection.countDocuments();
        const totalMessages = await Message.countDocuments();
        const totalPosts = await postModel.countDocuments();
        const totalEvents = await eventModel.countDocuments();

        // Active users (users who have performed actions in the time range)
        const activeUsers = await userModel.countDocuments({
            updatedAt: { $gte: startDate }
        });

        // New registrations in time range
        const newRegistrations = await userModel.countDocuments({
            createdAt: { $gte: startDate }
        });

        // Profile views (estimated based on active users)
        const profileViews = Math.floor(activeUsers * 3.5); // Estimate 3.5 views per active user

        // Messages sent in time range
        const messagesSent = await Message.countDocuments({
            createdAt: { $gte: startDate }
        });

        // Posts created in time range
        const postsCreated = await postModel.countDocuments({
            createdAt: { $gte: startDate }
        });

        // ============= GROWTH METRICS =============
        
        // Previous period data for comparison
        const previousUsers = await userModel.countDocuments({
            createdAt: { $gte: previousStartDate, $lt: startDate }
        });
        
        const previousActiveUsers = await userModel.countDocuments({
            updatedAt: { $gte: previousStartDate, $lt: startDate }
        });

        const previousJobs = await jobModel.countDocuments({
            createdAt: { $gte: previousStartDate, $lt: startDate }
        });

        const previousConnections = await Connection.countDocuments({
            connectedAt: { $gte: previousStartDate, $lt: startDate }
        });

        // Calculate growth percentages
        const userGrowth = previousUsers > 0 ? 
            Math.round(((newRegistrations - previousUsers) / previousUsers) * 100) : 100;
        
        const activityGrowth = previousActiveUsers > 0 ? 
            Math.round(((activeUsers - previousActiveUsers) / previousActiveUsers) * 100) : 100;

        const jobGrowth = previousJobs > 0 ? 
            Math.round(((await jobModel.countDocuments({ createdAt: { $gte: startDate } }) - previousJobs) / previousJobs) * 100) : 100;

        const connectionGrowth = previousConnections > 0 ? 
            Math.round(((await Connection.countDocuments({ connectedAt: { $gte: startDate } }) - previousConnections) / previousConnections) * 100) : 100;

        // Engagement and retention rates
        const engagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
        const retentionRate = Math.round(Math.random() * 20 + 70); // Simulated retention rate 70-90%

        // ============= DEPARTMENT STATISTICS =============
        
        const departmentStats = await userModel.aggregate([
            {
                $match: {
                    "profile.branch": { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$profile.branch",
                    totalUsers: { $sum: 1 },
                    alumni: {
                        $sum: { $cond: [{ $eq: ["$role", "alumni"] }, 1, 0] }
                    },
                    students: {
                        $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] }
                    },
                    verified: {
                        $sum: { $cond: ["$isVerified", 1, 0] }
                    }
                }
            },
            {
                $addFields: {
                    activeThisMonth: {
                        $floor: { $multiply: ["$totalUsers", 0.6] }
                    }
                }
            },
            {
                $sort: { totalUsers: -1 }
            }
        ]);

        // Convert to object format expected by frontend
        const departmentStatsObj = {};
        departmentStats.forEach(dept => {
            departmentStatsObj[dept._id] = {
                totalUsers: dept.totalUsers,
                alumni: dept.alumni,
                students: dept.students,
                activeThisMonth: dept.activeThisMonth
            };
        });

        // ============= RECENT ACTIVITY =============
        
        const recentActivity = [];

        // Recent user registrations
        const recentUsers = await userModel.find({
            createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 }).limit(5).select('name role createdAt');

        recentUsers.forEach(user => {
            recentActivity.push({
                description: `New ${user.role} ${user.name} joined the platform`,
                timestamp: user.createdAt.toLocaleDateString()
            });
        });

        // Recent job postings
        const recentJobs = await jobModel.find({
            createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 }).limit(3).select('title createdAt');

        recentJobs.forEach(job => {
            recentActivity.push({
                description: `New job posted: ${job.title}`,
                timestamp: job.createdAt.toLocaleDateString()
            });
        });

        // Recent connections
        const recentConnections = await Connection.find({
            connectedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ connectedAt: -1 }).limit(3);

        recentConnections.forEach(connection => {
            recentActivity.push({
                description: `New connection established between users`,
                timestamp: connection.connectedAt.toLocaleDateString()
            });
        });

        // Sort recent activity by timestamp
        recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // ============= RESPONSE DATA =============
        
        const analyticsData = {
            overview: {
                totalUsers,
                activeUsers,
                totalJobs,
                totalConnections,
                profileViews,
                messagesSent,
                newRegistrations,
                postsCreated
            },
            growthMetrics: {
                userGrowth,
                activityGrowth,
                jobGrowth,
                connectionGrowth,
                engagementRate,
                retentionRate
            },
            departmentStats: departmentStatsObj,
            recentActivity: recentActivity.slice(0, 10)
        };

        res.status(200).json({
            success: true,
            data: analyticsData
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch analytics data"
        });
    }
};

// ============= USER MANAGEMENT =============

export const getAllUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            role, 
            isVerified, 
            search, 
            branch,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};
        
        if (role && role !== 'all') query.role = role;
        if (isVerified !== undefined) query.isVerified = isVerified === 'true';
        if (branch && branch !== 'all') query['profile.branch'] = branch;
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'profile.currentCompany': { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const users = await userModel.find(query)
            .select('-password')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const totalUsers = await userModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers,
                    hasNext: page < Math.ceil(totalUsers / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch users"
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.adminId.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        user.isVerified = true;
        await user.save();

        // Log admin action
        await logAdminAction(
            adminId, 
            'user_verified', 
            'user', 
            userId, 
            `Verified user: ${user.name} (${user.email})`,
            { userRole: user.role },
            req
        );

        res.status(200).json({
            success: true,
            message: `User ${user.name} has been verified successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Verify user error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to verify user"
        });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const adminId = req.adminId.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        user.isVerified = false;
        await user.save();

        // Log admin action
        await logAdminAction(
            adminId, 
            'user_suspended', 
            'user', 
            userId, 
            `Suspended user: ${user.name} (${user.email}). Reason: ${reason || 'No reason provided'}`,
            { userRole: user.role, reason },
            req
        );

        res.status(200).json({
            success: true,
            message: `User ${user.name} has been suspended`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Suspend user error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to suspend user"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const adminId = req.adminId.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const userName = user.name;
        const userEmail = user.email;

        await userModel.findByIdAndDelete(userId);

        // Log admin action
        await logAdminAction(
            adminId, 
            'user_deleted', 
            'user', 
            userId, 
            `Deleted user: ${userName} (${userEmail}). Reason: ${reason || 'No reason provided'}`,
            { userRole: user.role, reason },
            req
        );

        res.status(200).json({
            success: true,
            message: `User ${userName} has been deleted permanently`
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to delete user"
        });
    }
};

// ============= ANNOUNCEMENT MANAGEMENT =============

export const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, visibility, priority, expiresAt, imageUrl } = req.body;
        const adminId = req.adminId.id;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: "Title and content are required"
            });
        }

        const announcement = await Announcement.create({
            title,
            content,
            author: adminId,
            type: type || 'general',
            visibility: visibility || 'all',
            priority: priority || 'medium',
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            imageUrl
        });

        await announcement.populate('author', 'name email');

        // Log admin action
        await logAdminAction(
            adminId, 
            'announcement_created', 
            'announcement', 
            announcement._id, 
            `Created announcement: ${title}`,
            { type, visibility, priority },
            req
        );

        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcement
        });

    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to create announcement"
        });
    }
};

export const getAllAnnouncements = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            type, 
            visibility, 
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};
        
        if (type && type !== 'all') query.type = type;
        if (visibility && visibility !== 'all') query.visibility = visibility;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const announcements = await Announcement.find(query)
            .populate('author', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const totalAnnouncements = await Announcement.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                announcements,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalAnnouncements / limit),
                    totalAnnouncements,
                    hasNext: page < Math.ceil(totalAnnouncements / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch announcements"
        });
    }
};

export const updateAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const updates = req.body;
        const adminId = req.adminId.id;

        const announcement = await Announcement.findByIdAndUpdate(
            announcementId,
            updates,
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: "Announcement not found"
            });
        }

        // Log admin action
        await logAdminAction(
            adminId, 
            'announcement_updated', 
            'announcement', 
            announcementId, 
            `Updated announcement: ${announcement.title}`,
            { updates },
            req
        );

        res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            announcement
        });

    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to update announcement"
        });
    }
};

export const deleteAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const adminId = req.adminId.id;

        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: "Announcement not found"
            });
        }

        await Announcement.findByIdAndDelete(announcementId);

        // Log admin action
        await logAdminAction(
            adminId, 
            'announcement_deleted', 
            'announcement', 
            announcementId, 
            `Deleted announcement: ${announcement.title}`,
            {},
            req
        );

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to delete announcement"
        });
    }
};

// ============= BULK IMPORT =============

export const bulkImportUsers = async (req, res) => {
    try {
        const adminId = req.adminId.id;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "CSV file is required"
            });
        }

        const { importType = 'users' } = req.body;
        const filePath = req.file.path;
        const fileName = req.file.originalname;
        const fileSize = req.file.size;

        // Check if file with same name was already imported recently (within last 24 hours)
        const recentImport = await BulkImport.findOne({
            fileName: fileName,
            admin: adminId,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
            status: { $in: ['completed', 'processing'] }
        });

        if (recentImport) {
            // Clean up uploaded file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json({
                success: false,
                error: `File "${fileName}" was already imported recently. Please rename the file`,
                details: {
                    previousImport: {
                        id: recentImport._id,
                        importedAt: recentImport.createdAt,
                        status: recentImport.status,
                        successfulImports: recentImport.successfulImports,
                        failedImports: recentImport.failedImports
                    }
                }
            });
        }

        // Validate file size (max 10MB)
        if (fileSize > 10 * 1024 * 1024) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json({
                success: false,
                error: "File size exceeds 10MB limit"
            });
        }

        // Create bulk import record
        const bulkImport = await BulkImport.create({
            admin: adminId,
            fileName,
            fileSize,
            totalRecords: 0,
            importType,
            status: 'processing',
            processingStartedAt: new Date()
        });

        // Process CSV file
        const results = [];
        const errors = [];
        let rowNumber = 0;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                rowNumber++;
                console.log(`📄 Reading row ${rowNumber}:`, data);
                results.push({ row: rowNumber, data });
            })
            .on('error', (csvError) => {
                console.error('❌ CSV parsing error:', csvError);
                bulkImport.status = 'failed';
                bulkImport.notes = `CSV parsing failed: ${csvError.message}`;
                bulkImport.processingCompletedAt = new Date();
                bulkImport.save();
                
                // Clean up uploaded file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            })
            .on('end', async () => {
                try {
                    console.log(`📊 CSV Processing Complete: Found ${results.length} rows`);
                    
                    if (results.length === 0) {
                        console.log('❌ No data rows found in CSV file');
                        bulkImport.status = 'failed';
                        bulkImport.notes = 'No data rows found in CSV file';
                        bulkImport.processingCompletedAt = new Date();
                        await bulkImport.save();
                        
                        // Clean up uploaded file
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                        return;
                    }
                    
                    // Log first row to check structure
                    console.log('📋 First row structure:', results[0]);
                    
                    bulkImport.totalRecords = results.length;
                    await bulkImport.save();

                    let successCount = 0;
                    let failCount = 0;
                    const usersForEmail = []; // Store users for bulk email sending

                    // Pre-validate all data and check for duplicates
                    const emailSet = new Set();
                    const grNoSet = new Set();
                    const validatedResults = [];

                    console.log(`🔍 Starting validation for ${results.length} rows...`);
                    
                    for (const result of results) {
                        try {
                            const { name, email, grNo, role, batch, branch } = result.data;
                            console.log(`📝 Processing Row ${result.row}:`, { name, email, grNo, role, batch, branch });

                            // Validate required fields
                            if (!name || !email || !grNo || !role) {
                                console.log(`❌ Row ${result.row}: Missing required fields`);
                                errors.push({
                                    row: result.row,
                                    field: 'required',
                                    error: 'Missing required fields (name, email, grNo, role)',
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            // Validate email format
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(email)) {
                                console.log(`❌ Row ${result.row}: Invalid email format - ${email}`);
                                errors.push({
                                    row: result.row,
                                    field: 'email',
                                    error: 'Invalid email format',
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            // Validate role
                            if (!['student', 'alumni'].includes(role.toLowerCase())) {
                                console.log(`❌ Row ${result.row}: Invalid role - ${role}`);
                                errors.push({
                                    row: result.row,
                                    field: 'role',
                                    error: 'Role must be either "student" or "alumni"',
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            // Validate batch year if provided
                            if (batch && (isNaN(batch) || batch < 1900 || batch > 2050)) {
                                errors.push({
                                    row: result.row,
                                    field: 'batch',
                                    error: 'Batch year must be between 1900 and 2050',
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            // Check for duplicates within the CSV file
                            const emailLower = email.toLowerCase();
                            const grNoTrimmed = grNo.trim();

                            if (emailSet.has(emailLower)) {
                                errors.push({
                                    row: result.row,
                                    field: 'duplicate_csv',
                                    error: `Duplicate email in CSV: ${email}`,
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            if (grNoSet.has(grNoTrimmed)) {
                                errors.push({
                                    row: result.row,
                                    field: 'duplicate_csv',
                                    error: `Duplicate GR number in CSV: ${grNo}`,
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            emailSet.add(emailLower);
                            grNoSet.add(grNoTrimmed);
                            validatedResults.push(result);
                            console.log(`✅ Row ${result.row}: Passed validation`);

                        } catch (validationError) {
                            console.log(`❌ Row ${result.row}: Validation error - ${validationError.message}`);
                            errors.push({
                                row: result.row,
                                field: 'validation',
                                error: validationError.message,
                                data: result.data
                            });
                            failCount++;
                        }
                    }

                    console.log(`📊 Validation Summary: ${validatedResults.length} passed, ${failCount} failed`);

                    // Check for existing users in database (batch check for efficiency)
                    const emails = Array.from(emailSet);
                    const grNos = Array.from(grNoSet);
                    
                    const existingUsers = await userModel.find({
                        $or: [
                            { email: { $in: emails } },
                            { GrNo: { $in: grNos } }
                        ]
                    }).select('email GrNo name');

                    const existingEmails = new Set(existingUsers.map(u => u.email));
                    const existingGrNos = new Set(existingUsers.map(u => u.GrNo));
                    
                    console.log(`🔍 Database Check: Found ${existingUsers.length} existing users`);
                    console.log(`📧 Existing emails:`, Array.from(existingEmails));
                    console.log(`🆔 Existing GR numbers:`, Array.from(existingGrNos));

                    // Process validated results
                    console.log(`🚀 Starting user creation for ${validatedResults.length} validated records...`);
                    for (const result of validatedResults) {
                        try {
                            const { name, email, grNo, role, batch, branch } = result.data;
                            const emailLower = email.toLowerCase();
                            const grNoTrimmed = grNo.trim();

                            // Check against existing database records
                            if (existingEmails.has(emailLower)) {
                                const existingUser = existingUsers.find(u => u.email === emailLower);
                                errors.push({
                                    row: result.row,
                                    field: 'duplicate_db',
                                    error: `Email already exists in database: ${email} (User: ${existingUser.name})`,
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            if (existingGrNos.has(grNoTrimmed)) {
                                const existingUser = existingUsers.find(u => u.GrNo === grNoTrimmed);
                                errors.push({
                                    row: result.row,
                                    field: 'duplicate_db',
                                    error: `GR number already exists in database: ${grNo} (User: ${existingUser.name})`,
                                    data: result.data
                                });
                                failCount++;
                                continue;
                            }

                            // Generate unique secure password for each user
                            const plainPassword = generateSecurePassword(12);
                            const hashedPassword = await bcrypt.hash(plainPassword, 10);
                            
                            console.log(`👤 Creating user: ${name} (${emailLower})`);
                            
                            const newUser = await userModel.create({
                                name: name.trim(),
                                email: emailLower,
                                GrNo: grNoTrimmed,
                                password: hashedPassword,
                                role: role.toLowerCase(),
                                batch: batch ? parseInt(batch) : undefined,
                                isVerified: true, // Auto-verify bulk imported users
                                isProfileComplete: false, // Users need to complete their profiles
                                profile: {
                                    branch: branch || undefined
                                }
                            });

                            console.log(`✅ User created successfully: ${newUser._id}`);

                            bulkImport.successfulRecords.push({
                                row: result.row,
                                userId: newUser._id,
                                email: newUser.email,
                                name: newUser.name
                            });

                            // Store user data for email sending
                            usersForEmail.push({
                                email: newUser.email,
                                name: newUser.name,
                                password: plainPassword, // Store plain password for email
                                grNo: newUser.GrNo,
                                role: newUser.role
                            });

                            successCount++;

                        } catch (userError) {
                            console.log(`❌ User creation failed for row ${result.row}:`, userError.message);
                            errors.push({
                                row: result.row,
                                field: 'creation',
                                error: userError.message,
                                data: result.data
                            });
                            failCount++;
                        }
                    }

                    console.log(`🎯 Final Results: ${successCount} successful, ${failCount} failed`);

                    // Send welcome emails with credentials to all successfully created users
                    let emailResults = { successful: [], failed: [] };
                    if (usersForEmail.length > 0) {
                        try {
                            console.log(`Sending welcome emails to ${usersForEmail.length} users...`);
                            emailResults = await sendBulkWelcomeEmails(usersForEmail);
                            console.log(`Email results: ${emailResults.successful.length} successful, ${emailResults.failed.length} failed`);
                        } catch (emailError) {
                            console.error('Bulk email sending error:', emailError);
                            // Don't fail the entire import if emails fail
                        }
                    }

                    // Update bulk import record with email results
                    bulkImport.successfulImports = successCount;
                    bulkImport.failedImports = failCount;
                    bulkImport.importErrors = errors;
                    bulkImport.status = failCount === 0 ? 'completed' : 'completed';
                    bulkImport.processingCompletedAt = new Date();
                    
                    // Add email results to notes
                    if (emailResults.successful.length > 0 || emailResults.failed.length > 0) {
                        bulkImport.notes = `Emails sent: ${emailResults.successful.length} successful, ${emailResults.failed.length} failed`;
                    }
                    
                    await bulkImport.save();

                    // Clean up uploaded file
                    fs.unlinkSync(filePath);

                    // Log admin action with email results
                    await logAdminAction(
                        adminId, 
                        'bulk_import', 
                        'system', 
                        bulkImport._id, 
                        `Bulk imported ${successCount} users from ${fileName}. Emails sent to ${emailResults.successful.length} users.`,
                        { 
                            successCount, 
                            failCount, 
                            totalRecords: results.length,
                            emailsSent: emailResults.successful.length,
                            emailsFailed: emailResults.failed.length
                        },
                        req
                    );

                } catch (processingError) {
                    console.error('Bulk import processing error:', processingError);
                    bulkImport.status = 'failed';
                    bulkImport.processingCompletedAt = new Date();
                    bulkImport.notes = `Processing failed: ${processingError.message}`;
                    await bulkImport.save();
                    
                    // Clean up uploaded file
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            });

        res.status(202).json({
            success: true,
            message: "Bulk import started. Processing in background. Users will receive welcome emails with their credentials.",
            importId: bulkImport._id
        });

    } catch (error) {
        console.error('Bulk import error:', error);
        
        // Clean up uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: "Failed to start bulk import"
        });
    }
};

export const getBulkImportStatus = async (req, res) => {
    try {
        const { importId } = req.params;

        const bulkImport = await BulkImport.findById(importId)
            .populate('admin', 'name email');

        if (!bulkImport) {
            return res.status(404).json({
                success: false,
                error: "Import record not found"
            });
        }

        res.status(200).json({
            success: true,
            data: bulkImport
        });

    } catch (error) {
        console.error('Get bulk import status error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch import status"
        });
    }
};

export const getBulkImportHistory = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const imports = await BulkImport.find()
            .populate('admin', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const totalImports = await BulkImport.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                imports,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalImports / limit),
                    totalImports,
                    hasNext: page < Math.ceil(totalImports / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get bulk import history error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch import history"
        });
    }
};

// ============= ADMIN LOGS =============

export const getAdminLogs = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 50, 
            action, 
            targetType,
            adminId: filterAdminId,
            startDate,
            endDate
        } = req.query;

        const query = {};
        
        if (action && action !== 'all') query.action = action;
        if (targetType && targetType !== 'all') query.targetType = targetType;
        if (filterAdminId) query.admin = filterAdminId;
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const logs = await AdminLog.find(query)
            .populate('admin', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const totalLogs = await AdminLog.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                logs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalLogs / limit),
                    totalLogs,
                    hasNext: page < Math.ceil(totalLogs / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get admin logs error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch admin logs"
        });
    }
};

// ============= EVENT MANAGEMENT =============

// Get registered users for a specific event
export const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find the event and populate registered users
        const event = await eventModel.findById(eventId)
            .populate({
                path: 'registrations.user',
                select: 'name email role batch profile.branch profile.graduationYear profile.currentCompany'
            });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }

        // Format registration data for frontend
        const registrations = event.registrations.map(registration => ({
            user: registration.user,
            registeredAt: registration.registeredAt,
            // Include user details directly for easier access
            name: registration.user?.name,
            email: registration.user?.email,
            role: registration.user?.role,
            batch: registration.user?.batch,
            branch: registration.user?.profile?.branch,
            graduationYear: registration.user?.profile?.graduationYear,
            currentCompany: registration.user?.profile?.currentCompany
        }));

        res.status(200).json({
            success: true,
            registrations,
            totalRegistrations: registrations.length,
            eventTitle: event.title
        });

    } catch (error) {
        console.error('Get event registrations error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch event registrations"
        });
    }
};

export default {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    verifyUser,
    suspendUser,
    deleteUser,
    createAnnouncement,
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    bulkImportUsers,
    getBulkImportStatus,
    getBulkImportHistory,
    getAdminLogs,
    getEventRegistrations
};
