import mongoose from 'mongoose';

// Job Schema - For job postings by alumni
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    company: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        required: true
    },
    workMode: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'On-site'
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    requirements: [{
        type: String,
        trim: true,
        maxLength: 200
    }],
    responsibilities: [{
        type: String,
        trim: true,
        maxLength: 200
    }],
    benefits: [{
        type: String,
        trim: true,
        maxLength: 200
    }],
    salaryRange: {
        min: {
            type: Number,
            min: 0
        },
        max: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    experienceLevel: {
        type: String,
        enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
        required: true
    },
    category: {
        type: String,
        enum: [
            'Software Development',
            'Data Science',
            'Product Management',
            'Design',
            'Marketing',
            'Sales',
            'Finance',
            'Operations',
            'Human Resources',
            'Engineering',
            'Other'
        ],
        required: true
    },
    skills: [{
        type: String,
        trim: true,
        maxLength: 50
    }],
    applicationDeadline: {
        type: Date
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'closed', 'expired'],
        default: 'active'
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    contactEmail: {
        type: String,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    applicationUrl: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Job Application Schema - For tracking applications to jobs
const jobApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        maxLength: 1000,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    notes: {
        type: String,
        maxLength: 500
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
jobSchema.index({ postedBy: 1, createdAt: -1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ category: 1, jobType: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ 'salaryRange.min': 1, 'salaryRange.max': 1 });

jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications
jobApplicationSchema.index({ applicant: 1, createdAt: -1 });
jobApplicationSchema.index({ job: 1, status: 1 });

// Pre-save middleware to update applications count
jobApplicationSchema.post('save', async function() {
    try {
        const count = await mongoose.model('JobApplication').countDocuments({ job: this.job });
        await mongoose.model('Job').findByIdAndUpdate(this.job, { applicationsCount: count });
    } catch (error) {
        console.error('Error updating applications count:', error);
    }
});

// Pre-remove middleware to update applications count
jobApplicationSchema.post('remove', async function() {
    try {
        const count = await mongoose.model('JobApplication').countDocuments({ job: this.job });
        await mongoose.model('Job').findByIdAndUpdate(this.job, { applicationsCount: count });
    } catch (error) {
        console.error('Error updating applications count:', error);
    }
});

// Virtual for checking if application deadline has passed
jobSchema.virtual('isExpired').get(function() {
    if (!this.applicationDeadline) return false;
    return new Date() > this.applicationDeadline;
});

// Method to check if user has already applied
jobSchema.methods.hasUserApplied = async function(userId) {
    const application = await mongoose.model('JobApplication').findOne({
        job: this._id,
        applicant: userId
    });
    return !!application;
};

export const Job = mongoose.model('Job', jobSchema);
export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
