import { Job, JobApplication } from '../models/jobModel.js';
import { userModel } from '../models/userModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Create a new job (Alumni only)
export const createJob = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Check if user is alumni
        const user = await userModel.findById(userId);
        if (!user || user.role !== 'alumni') {
            return res.status(403).json({
                success: false,
                error: "Only alumni can post jobs"
            });
        }

        const jobData = {
            ...req.body,
            postedBy: userId
        };

        // Validate required fields
        const requiredFields = ['title', 'company', 'location', 'jobType', 'description', 'experienceLevel', 'category'];
        const missingFields = requiredFields.filter(field => !jobData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const job = new Job(jobData);
        await job.save();

        // Populate poster information
        await job.populate('postedBy', 'name profile.currentCompany profile.currentPosition profile.avatarUrl');

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job
        });

    } catch (error) {
        console.error('Create job error:', error.message);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get all jobs with filters and pagination
export const getAllJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            jobType,
            location,
            experienceLevel,
            salaryMin,
            salaryMax,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter query
        let filter = { status: 'active' };

        // Search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Category filter
        if (category && category !== 'All') {
            filter.category = category;
        }

        // Job type filter
        if (jobType && jobType !== 'All') {
            filter.jobType = jobType;
        }

        // Location filter
        if (location && location !== 'All') {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Experience level filter
        if (experienceLevel && experienceLevel !== 'All') {
            filter.experienceLevel = experienceLevel;
        }

        // Salary range filter
        if (salaryMin || salaryMax) {
            filter['salaryRange.min'] = {};
            if (salaryMin) filter['salaryRange.min'].$gte = parseInt(salaryMin);
            if (salaryMax) filter['salaryRange.max'] = { $lte: parseInt(salaryMax) };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch jobs with pagination
        const jobs = await Job
            .find(filter)
            .populate('postedBy', 'name profile.currentCompany profile.currentPosition profile.avatarUrl')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await Job.countDocuments(filter);

        res.status(200).json({
            success: true,
            jobs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get all jobs error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get single job by ID
export const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid job ID format"
            });
        }

        const job = await Job
            .findById(jobId)
            .populate('postedBy', 'name profile.currentCompany profile.currentPosition profile.avatarUrl email');

        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        // Increment views count
        await Job.findByIdAndUpdate(jobId, { $inc: { viewsCount: 1 } });

        // Check if current user has applied (if authenticated)
        let hasApplied = false;
        if (req.userId) {
            hasApplied = await job.hasUserApplied(req.userId);
        }

        res.status(200).json({
            success: true,
            job: {
                ...job.toObject(),
                hasApplied
            }
        });

    } catch (error) {
        console.error('Get job by ID error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Update job (Only by job poster)
export const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid job ID format"
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        // Check if user is the job poster
        if (job.postedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "You can only update your own job postings"
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('postedBy', 'name profile.currentCompany profile.currentPosition profile.avatarUrl');

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        console.error('Update job error:', error.message);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Delete job (Only by job poster)
export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid job ID format"
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        // Check if user is the job poster
        if (job.postedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "You can only delete your own job postings"
            });
        }

        // Delete all applications for this job
        await JobApplication.deleteMany({ job: jobId });

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error('Delete job error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Apply to a job with resume upload
export const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.userId;
        const { coverLetter } = req.body;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid job ID format"
            });
        }

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        if (job.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: "This job is no longer accepting applications"
            });
        }

        // Check if application deadline has passed
        if (job.applicationDeadline && new Date() > job.applicationDeadline) {
            return res.status(400).json({
                success: false,
                error: "Application deadline has passed"
            });
        }

        // Check if user has already applied
        const existingApplication = await JobApplication.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: "You have already applied to this job"
            });
        }

        // Check if resume file is uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Resume file is required"
            });
        }

        // Upload resume to Cloudinary as image (this works better for viewing)
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'alumni-bridge/resumes',
                    resource_type: 'image',
                    public_id: `resume_${userId}_${Date.now()}`,
                    format: 'pdf',
                    type: 'upload',
                    access_mode: 'public'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        // Use the secure URL - this should work for PDF viewing
        const pdfUrl = result.secure_url;

        // Create job application
        const application = new JobApplication({
            job: jobId,
            applicant: userId,
            resumeUrl: pdfUrl,
            coverLetter: coverLetter || ''
        });

        await application.save();

        // Populate applicant information
        await application.populate('applicant', 'name email profile.phone profile.currentCompany profile.currentPosition profile.avatarUrl');

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error('Apply to job error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get job applications for a specific job (Only by job poster)
export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.userId;
        const { status, page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid job ID format"
            });
        }

        // Check if job exists and user is the poster
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: "Job not found"
            });
        }

        if (job.postedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "You can only view applications for your own job postings"
            });
        }

        // Build filter
        let filter = { job: jobId };
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get applications
        const applications = await JobApplication
            .find(filter)
            .populate('applicant', 'name email profile.phone profile.currentCompany profile.currentPosition profile.avatarUrl batch profile.branch')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await JobApplication.countDocuments(filter);

        res.status(200).json({
            success: true,
            applications,
            job: {
                title: job.title,
                company: job.company
            },
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get job applications error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get user's job applications
export const getMyApplications = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, page = 1, limit = 10 } = req.query;

        // Build filter
        let filter = { applicant: userId };
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get applications
        const applications = await JobApplication
            .find(filter)
            .populate({
                path: 'job',
                select: 'title company location jobType status createdAt postedBy',
                populate: {
                    path: 'postedBy',
                    select: 'name profile.currentCompany'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await JobApplication.countDocuments(filter);

        res.status(200).json({
            success: true,
            applications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get my applications error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get jobs posted by current user (Alumni only)
export const getMyJobs = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, page = 1, limit = 10 } = req.query;

        // Check if user is alumni
        const user = await userModel.findById(userId);
        if (!user || user.role !== 'alumni') {
            return res.status(403).json({
                success: false,
                error: "Only alumni can access this endpoint"
            });
        }

        // Build filter
        let filter = { postedBy: userId };
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get jobs
        const jobs = await Job
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await Job.countDocuments(filter);

        res.status(200).json({
            success: true,
            jobs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get my jobs error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Update application status (Only by job poster)
// Serve resume PDF with proper headers
export const serveResume = async (req, res) => {
    try {
        const { publicId } = req.params;
        
        // Construct the Cloudinary URL - remove the v1 part as it's included in publicId
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}.pdf`;
        
        // Set proper headers for PDF viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        
        // Redirect to Cloudinary URL with proper headers
        res.redirect(cloudinaryUrl);
        
    } catch (error) {
        console.error('Serve resume error:', error.message);
        res.status(500).json({
            success: false,
            error: "Failed to load resume"
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, notes } = req.body;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid application ID format"
            });
        }

        const application = await JobApplication.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({
                success: false,
                error: "Application not found"
            });
        }

        // Check if user is the job poster
        if (application.job.postedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "You can only update applications for your own job postings"
            });
        }

        // Update application
        application.status = status;
        if (notes) application.notes = notes;
        if (status !== 'pending') application.reviewedAt = new Date();

        await application.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error('Update application status error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};
