import express from 'express'
import { getEvent, registerForEvent, unregisterFromEvent, getEventRegistrations } from '../controllers/Event.js'
import { AuthUser } from '../middlewere/userAuth.js'

export const eventRoute=express.Router()

// Public route for getting events (no authentication required for now)
eventRoute.get('/get', getEvent)

// Protected route for getting events (requires authentication)
eventRoute.get('/get-auth', AuthUser, getEvent)

// Event registration routes (require authentication)
eventRoute.post('/:eventId/register', AuthUser, registerForEvent)
eventRoute.delete('/:eventId/unregister', AuthUser, unregisterFromEvent)
eventRoute.get('/:eventId/registrations', AuthUser, getEventRegistrations)

