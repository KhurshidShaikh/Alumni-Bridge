import express from 'express';
import { AuthUser } from '../middlewere/userAuth.js';

const router = express.Router();

// Get public events for users
router.get('/', async (req, res) => {
    try {
        const { EventModel } = await import('../models/Event.js');
        const { userModel } = await import('../models/userModel.js');
        
        const { page = 1, limit = 20, search = '', visibility = 'public' } = req.query;
        
        let query = { visibility: 'public' }; // Only show public events to users
        
        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Only show future events
        query.date = { $gte: new Date() };
        
        const skip = (page - 1) * limit;
        const events = await EventModel.find(query)
            .populate('createdBy', 'name email profileImage')
            .sort({ date: 1 }) // Sort by date ascending (upcoming first)
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalEvents = await EventModel.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);
        
        res.status(200).json({
            success: true,
            data: events,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEvents,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching public events:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch events"
        });
    }
});

// Get single event details
router.get('/:eventId', async (req, res) => {
    try {
        const { EventModel } = await import('../models/Event.js');
        
        const event = await EventModel.findById(req.params.eventId)
            .populate('createdBy', 'name email profileImage');
            
        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }
        
        // Only allow access to public events or if user is authenticated
        if (event.visibility === 'private' && !req.user) {
            return res.status(403).json({
                success: false,
                error: "Access denied to private event"
            });
        }
        
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch event details"
        });
    }
});

// Register for an event (requires authentication)
router.post('/:eventId/register', AuthUser, async (req, res) => {
    try {
        const { EventModel } = await import('../models/Event.js');
        
        const event = await EventModel.findById(req.params.eventId);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }
        
        // Check if event is in the future
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({
                success: false,
                error: "Cannot register for past events"
            });
        }
        
        // Here you would typically add the user to the event's attendees list
        // For now, we'll just return a success message
        res.status(200).json({
            success: true,
            message: "Successfully registered for event"
        });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({
            success: false,
            error: "Failed to register for event"
        });
    }
});

export default router;
