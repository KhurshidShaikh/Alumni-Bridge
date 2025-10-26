import express from 'express';
import multer from 'multer';
import path from 'path';
import { AuthAdmin } from '../middlewere/AdminAuth.js';
import {
    adminLogin,
    getDashboardStats,
    getAnalytics,
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
} from '../controllers/Admin.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/bulk-imports/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'bulk-import-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

// ============= AUTHENTICATION ROUTES =============
router.post('/login', adminLogin);

// ============= DASHBOARD ROUTES =============
router.get('/dashboard/stats', AuthAdmin, getDashboardStats);
router.get('/analytics', AuthAdmin, getAnalytics);

// ============= USER MANAGEMENT ROUTES =============
router.get('/users', AuthAdmin, getAllUsers);
router.put('/users/:userId/verify', AuthAdmin, verifyUser);
router.put('/users/:userId/suspend', AuthAdmin, suspendUser);
router.delete('/users/:userId', AuthAdmin, deleteUser);

// ============= ANNOUNCEMENT MANAGEMENT ROUTES =============
router.post('/announcements', AuthAdmin, createAnnouncement);
router.get('/announcements', AuthAdmin, getAllAnnouncements);
router.put('/announcements/:announcementId', AuthAdmin, updateAnnouncement);
router.delete('/announcements/:announcementId', AuthAdmin, deleteAnnouncement);

// ============= BULK IMPORT ROUTES =============
router.post('/bulk-import', AuthAdmin, upload.single('csvFile'), bulkImportUsers);
router.get('/bulk-import/history', AuthAdmin, getBulkImportHistory);
router.get('/bulk-import/:importId/status', AuthAdmin, getBulkImportStatus);

// ============= ADMIN LOGS ROUTES =============
router.get('/logs', AuthAdmin, getAdminLogs);

// ============= ADMIN MESSAGING ROUTES =============
// Get all alumni for admin messaging
router.get('/alumni', AuthAdmin, async (req, res) => {
    try {
        const { userModel } = await import('../models/userModel.js');
        const { batch, branch, search, limit = 50, page = 1 } = req.query;
        
        let query = {
            role: 'alumni',
            isVerified: true
        };
        
        // Add search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'profile.currentCompany': { $regex: search, $options: 'i' } },
                { 'profile.currentPosition': { $regex: search, $options: 'i' } }
            ];
        }
        
        // Add batch filter
        if (batch && batch !== 'all') {
            query.batch = parseInt(batch);
        }
        
        // Add branch filter
        if (branch && branch !== 'all') {
            query['profile.branch'] = branch;
        }
        
        const skip = (page - 1) * limit;
        const alumni = await userModel.find(query)
            .select('name email batch profile role isVerified')
            .sort({ name: 1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalCount = await userModel.countDocuments(query);
        
        res.status(200).json({
            success: true,
            alumni,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching alumni for admin:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch alumni",
            details: error.message
        });
    }
});

// ============= CONTENT MANAGEMENT ROUTES =============
// These will use existing controllers with admin middleware

// Job management
router.get('/jobs', AuthAdmin, async (req, res) => {
    try {
        const { Job: jobModel } = await import('../models/jobModel.js');
        const jobs = await jobModel.find()
            .populate('postedBy', 'name email profile.currentCompany')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch jobs"
        });
    }
});

router.delete('/jobs/:jobId', AuthAdmin, async (req, res) => {
    try {
        const { Job: jobModel } = await import('../models/jobModel.js');
        const { AdminLog } = await import('../models/adminLogModel.js');
        
        const job = await jobModel.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        await jobModel.findByIdAndDelete(req.params.jobId);

        // Log admin action
        await AdminLog.create({
            admin: req.adminId.id,
            action: 'job_deleted',
            targetType: 'job',
            targetId: req.params.jobId,
            details: `Deleted job: ${job.title} by ${job.postedBy}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to delete job"
        });
    }
});

// Post management
router.get('/posts', AuthAdmin, async (req, res) => {
    try {
        const { Post: postModel } = await import('../models/postModel.js');
        const posts = await postModel.find()
            .populate('author', 'name email profile.currentCompany')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch posts"
        });
    }
});

router.delete('/posts/:postId', AuthAdmin, async (req, res) => {
    try {
        const { Post: postModel } = await import('../models/postModel.js');
        const { AdminLog } = await import('../models/adminLogModel.js');
        
        const post = await postModel.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found"
            });
        }

        await postModel.findByIdAndDelete(req.params.postId);

        // Log admin action
        await AdminLog.create({
            admin: req.adminId.id,
            action: 'post_deleted',
            targetType: 'post',
            targetId: req.params.postId,
            details: `Deleted post by ${post.author}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to delete post"
        });
    }
});

// Event management routes
router.get('/events', AuthAdmin, async (req, res) => {
    try {
        const { EventModel: eventModel } = await import('../models/Event.js');
        const { page = 1, limit = 20, search = '', visibility = '' } = req.query;
        
        let query = {};
        
        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Add visibility filter
        if (visibility) {
            query.visibility = visibility;
        }
        
        const skip = (page - 1) * limit;
        const events = await eventModel.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalEvents = await eventModel.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);
        
        // Add registration count to each event
        const eventsWithCount = events.map(event => ({
            ...event.toObject(),
            registeredCount: event.registrations ? event.registrations.length : 0
        }));
        
        res.status(200).json({
            success: true,
            data: eventsWithCount,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEvents,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch events"
        });
    }
});

router.post('/events', AuthAdmin, async (req, res) => {
    try {
        const { EventModel: eventModel } = await import('../models/Event.js');
        const { AdminLog } = await import('../models/adminLogModel.js');
        
        const eventData = {
            ...req.body,
            createdBy: req.adminId.id,
            createdAt: new Date()
        };

        const event = await eventModel.create(eventData);
        await event.populate('createdBy', 'name email');

        // Log admin action
        await AdminLog.create({
            admin: req.adminId.id,
            action: 'event_created',
            targetType: 'event',
            targetId: event._id,
            details: `Created event: ${event.title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to create event"
        });
    }
});

router.put('/events/:eventId', AuthAdmin, async (req, res) => {
    try {
        const { EventModel: eventModel } = await import('../models/Event.js');
        const { AdminLog } = await import('../models/adminLogModel.js');
        
        const event = await eventModel.findByIdAndUpdate(
            req.params.eventId,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }

        // Log admin action
        await AdminLog.create({
            admin: req.adminId.id,
            action: 'event_updated',
            targetType: 'event',
            targetId: event._id,
            details: `Updated event: ${event.title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to update event"
        });
    }
});

router.delete('/events/:eventId', AuthAdmin, async (req, res) => {
    try {
        const { EventModel: eventModel } = await import('../models/Event.js');
        const { AdminLog } = await import('../models/adminLogModel.js');
        
        const event = await eventModel.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }

        await eventModel.findByIdAndDelete(req.params.eventId);

        // Log admin action
        await AdminLog.create({
            admin: req.adminId.id,
            action: 'event_deleted',
            targetType: 'event',
            targetId: req.params.eventId,
            details: `Deleted event: ${event.title}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to delete event"
        });
    }
});

// Get event registrations
router.get('/events/:eventId/registrations', AuthAdmin, getEventRegistrations);

export default router;
