import express from 'express';
import multer from 'multer';
import { AuthUser } from '../middlewere/userAuth.js';
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    applyToJob,
    getJobApplications,
    getMyApplications,
    getMyJobs,
    updateApplicationStatus,
    serveResume
} from '../controllers/Job.js';

const router = express.Router();

// Configure multer for resume uploads (memory storage for Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept only PDF files for resumes
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for resumes'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Public routes
router.get('/', getAllJobs); // Get all jobs with filters

// Protected routes (require authentication)
router.use(AuthUser); // Apply auth middleware to all routes below

// User-specific routes (must come before dynamic routes)
router.get('/my/jobs', getMyJobs); // Get jobs posted by current user (Alumni only)
router.get('/my/applications', getMyApplications); // Get current user's applications

// Job CRUD operations
router.post('/', createJob); // Create new job (Alumni only)
router.put('/:jobId', updateJob); // Update job (Job poster only)
router.delete('/:jobId', deleteJob); // Delete job (Job poster only)

// Job application routes
router.post('/:jobId/apply', upload.single('resume'), applyToJob); // Apply to job with resume
router.get('/:jobId/applications', getJobApplications); // Get applications for a job (Job poster only)
router.put('/applications/:applicationId/status', updateApplicationStatus); // Update application status

// Dynamic routes (must come last)
router.get('/:jobId', getJobById); // Get single job by ID

export { router as jobRoute };
