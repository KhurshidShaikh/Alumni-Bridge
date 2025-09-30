import { EventModel } from "../models/Event.js";
import {v2 as cloudinary} from 'cloudinary'

export const getEvent=async(req,res)=>{
    try{
        const { page = 1, limit = 20, search = '' } = req.query;

        // Build query
        let query = {};

        // Add search filter if provided
        if (search && search.trim() !== '') {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        // Only filter by visibility if the field exists and has values
        const sampleEvent = await EventModel.findOne({});
        if (sampleEvent && sampleEvent.visibility) {
            query.visibility = { $in: ['public', null, undefined] };
        }

        // No date filtering - show all events

        const skip = (page - 1) * limit;
        const events = await EventModel.find(query)
            .populate('createdBy', 'name email profileImage')
            .populate('registrations.user', 'name email')
            .sort({ date: -1 }) // Sort by date descending (newest first)
            .skip(skip)
            .limit(parseInt(limit));

        const totalEvents = await EventModel.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);

        // Add user registration status to each event if user is authenticated
        let eventsWithStatus = events;
        if (req.userId) {
            eventsWithStatus = events.map(event => {
                const eventObj = event.toObject();
                const isRegistered = event.registrations.some(
                    registration => registration.user && registration.user._id.toString() === req.userId
                );
                return {
                    ...eventObj,
                    isRegistered,
                    registrationCount: event.registrations.length
                };
            });
        } else {
            eventsWithStatus = events.map(event => ({
                ...event.toObject(),
                isRegistered: false,
                registrationCount: event.registrations.length
            }));
        }

        res.status(200).json({
            success: true,
            data: eventsWithStatus,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEvents,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }
    catch(e){
        res.status(500).json({success:false,error:e.message})
    }
}

// Register for event
export const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req;

        // Find the event
        const event = await EventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Get user details
        const { userModel } = await import('../models/userModel.js');
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if user is already registered
        const isAlreadyRegistered = event.registrations.some(
            registration => registration.user.toString() === userId
        );

        if (isAlreadyRegistered) {
            return res.status(400).json({
                success: false,
                error: 'You are already registered for this event'
            });
        }

        // Add registration
        event.registrations.push({
            user: userId,
            name: user.name,
            email: user.email,
            registeredAt: new Date()
        });

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully registered for the event',
            registrationCount: event.registrations.length
        });

    } catch (error) {
        console.error('Event registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to register for event'
        });
    }
}

// Unregister from event
export const unregisterFromEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req;

        // Find the event
        const event = await EventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Check if user is registered
        const registrationIndex = event.registrations.findIndex(
            registration => registration.user.toString() === userId
        );

        if (registrationIndex === -1) {
            return res.status(400).json({
                success: false,
                error: 'You are not registered for this event'
            });
        }

        // Remove registration
        event.registrations.splice(registrationIndex, 1);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully unregistered from the event',
            registrationCount: event.registrations.length
        });

    } catch (error) {
        console.error('Event unregistration error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unregister from event'
        });
    }
}

// Get event registrations (for admin)
export const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await EventModel.findById(eventId)
            .populate('registrations.user', 'name email profile.profileImage')
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event: {
                _id: event._id,
                title: event.title,
                date: event.date,
                location: event.location,
                createdBy: event.createdBy,
                registrations: event.registrations,
                registrationCount: event.registrations.length
            }
        });

    } catch (error) {
        console.error('Get event registrations error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get event registrations'
        });
    }
}