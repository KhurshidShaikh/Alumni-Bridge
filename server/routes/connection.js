import express from 'express';
import { AuthUser } from '../middlewere/userAuth.js';
import {
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    withdrawConnectionRequest,
    getUserConnections,
    getConnectionRequests,
    getConnectionStatus,
    removeConnection
} from '../controllers/Connection.js';

export const connectionRoute = express.Router();

// Connection request routes
connectionRoute.post('/request', AuthUser, sendConnectionRequest);
connectionRoute.put('/request/:requestId/accept', AuthUser, acceptConnectionRequest);
connectionRoute.put('/request/:requestId/decline', AuthUser, declineConnectionRequest);
connectionRoute.delete('/request/:requestId/withdraw', AuthUser, withdrawConnectionRequest);

// Connection management routes
connectionRoute.get('/my-connections', AuthUser, getUserConnections);
connectionRoute.get('/requests', AuthUser, getConnectionRequests);
connectionRoute.get('/status/:targetUserId', AuthUser, getConnectionStatus);
connectionRoute.delete('/:connectionId', AuthUser, removeConnection);
