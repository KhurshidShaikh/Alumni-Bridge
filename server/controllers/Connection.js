import { ConnectionRequest, Connection } from '../models/connectionModel.js';
import { userModel } from '../models/userModel.js';
import mongoose from 'mongoose';

// Send connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const fromUserId = req.userId;
        const { toUserId, message = '' } = req.body;

        // Validate input
        if (!toUserId) {
            return res.status(400).json({
                success: false,
                error: "Target user ID is required"
            });
        }

        // Check if trying to connect to self
        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({
                success: false,
                error: "Cannot send connection request to yourself"
            });
        }

        // Check if target user exists
        const targetUser = await userModel.findById(toUserId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Check if connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUser: fromUserId, toUser: toUserId },
                { fromUser: toUserId, toUser: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                error: "Connection request already exists"
            });
        }

        // Check if already connected
        const existingConnection = await Connection.findOne({
            $or: [
                { user1: fromUserId, user2: toUserId },
                { user1: toUserId, user2: fromUserId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                error: "Already connected with this user"
            });
        }

        // Create connection request
        const connectionRequest = await ConnectionRequest.create({
            fromUser: fromUserId,
            toUser: toUserId,
            message: message.trim()
        });

        // Populate user details for response
        await connectionRequest.populate('fromUser', 'name profile.profileUrl');
        await connectionRequest.populate('toUser', 'name profile.profileUrl');

        res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            request: connectionRequest
        });

    } catch (error) {
        console.error('Send connection request error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { requestId } = req.params;

        // Find the connection request
        const connectionRequest = await ConnectionRequest.findById(requestId);
        
        if (!connectionRequest) {
            return res.status(404).json({
                success: false,
                error: "Connection request not found"
            });
        }

        // Check if user is the recipient of the request
        if (connectionRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to accept this request"
            });
        }

        // Check if request is still pending
        if (connectionRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: "Request is no longer pending"
            });
        }

        // Start transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update request status
            connectionRequest.status = 'accepted';
            await connectionRequest.save({ session });

            // Create connection
            const connection = await Connection.create([{
                user1: connectionRequest.fromUser,
                user2: connectionRequest.toUser,
                connectionType: 'alumni'
            }], { session });

            await session.commitTransaction();

            // Populate user details for response
            await connectionRequest.populate('fromUser', 'name profile.profileUrl');
            await connectionRequest.populate('toUser', 'name profile.profileUrl');

            res.status(200).json({
                success: true,
                message: "Connection request accepted",
                request: connectionRequest,
                connection: connection[0]
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Accept connection request error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Decline connection request
export const declineConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { requestId } = req.params;

        // Find the connection request
        const connectionRequest = await ConnectionRequest.findById(requestId);
        
        if (!connectionRequest) {
            return res.status(404).json({
                success: false,
                error: "Connection request not found"
            });
        }

        // Check if user is the recipient of the request
        if (connectionRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to decline this request"
            });
        }

        // Update request status
        connectionRequest.status = 'declined';
        await connectionRequest.save();

        res.status(200).json({
            success: true,
            message: "Connection request declined"
        });

    } catch (error) {
        console.error('Decline connection request error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Withdraw connection request
export const withdrawConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { requestId } = req.params;

        // Find and delete the connection request
        const connectionRequest = await ConnectionRequest.findOneAndDelete({
            _id: requestId,
            fromUser: userId,
            status: 'pending'
        });

        if (!connectionRequest) {
            return res.status(404).json({
                success: false,
                error: "Connection request not found or cannot be withdrawn"
            });
        }

        res.status(200).json({
            success: true,
            message: "Connection request withdrawn"
        });

    } catch (error) {
        console.error('Withdraw connection request error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get user's connections
export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;
        const { search, limit = 20, page = 1 } = req.query;

        // Build search query
        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { 'user1Details.name': { $regex: search, $options: 'i' } },
                    { 'user2Details.name': { $regex: search, $options: 'i' } },
                    { 'user1Details.profile.currentCompany': { $regex: search, $options: 'i' } },
                    { 'user2Details.profile.currentCompany': { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Aggregate to get connections with user details
        const connections = await Connection.aggregate([
            {
                $match: {
                    $or: [
                        { user1: new mongoose.Types.ObjectId(userId) },
                        { user2: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user1',
                    foreignField: '_id',
                    as: 'user1Details'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user2',
                    foreignField: '_id',
                    as: 'user2Details'
                }
            },
            {
                $unwind: '$user1Details'
            },
            {
                $unwind: '$user2Details'
            },
            {
                $addFields: {
                    connectedUser: {
                        $cond: {
                            if: { $eq: ['$user1', new mongoose.Types.ObjectId(userId)] },
                            then: '$user2Details',
                            else: '$user1Details'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    connectionType: 1,
                    connectedAt: 1,
                    connectedUser: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        batch: 1,
                        role: 1,
                        profile: {
                            profileUrl: 1,
                            currentCompany: 1,
                            currentPosition: 1,
                            location: 1,
                            branch: 1
                        }
                    }
                }
            },
            ...(search ? [{ $match: searchQuery }] : []),
            { $sort: { connectedAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);

        // Get total count
        const totalCount = await Connection.countDocuments({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        });

        res.status(200).json({
            success: true,
            connections,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get user connections error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get pending connection requests (both sent and received)
export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const { type = 'all' } = req.query; // 'sent', 'received', or 'all'

        let query = {};
        
        if (type === 'sent') {
            query = { fromUser: userId, status: 'pending' };
        } else if (type === 'received') {
            query = { toUser: userId, status: 'pending' };
        } else {
            query = {
                $or: [
                    { fromUser: userId, status: 'pending' },
                    { toUser: userId, status: 'pending' }
                ]
            };
        }

        const requests = await ConnectionRequest.find(query)
            .populate('fromUser', 'name profile.profileUrl profile.currentCompany profile.currentPosition batch role')
            .populate('toUser', 'name profile.profileUrl profile.currentCompany profile.currentPosition batch role')
            .sort({ createdAt: -1 });

        // Separate sent and received requests
        const sentRequests = requests.filter(req => req.fromUser._id.toString() === userId.toString());
        const receivedRequests = requests.filter(req => req.toUser._id.toString() === userId.toString());

        res.status(200).json({
            success: true,
            requests: {
                sent: sentRequests,
                received: receivedRequests,
                all: requests
            }
        });

    } catch (error) {
        console.error('Get connection requests error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get connection status between two users
export const getConnectionStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { targetUserId } = req.params;

        // Check if there's an existing connection
        const connection = await Connection.findOne({
            $or: [
                { user1: userId, user2: targetUserId },
                { user1: targetUserId, user2: userId }
            ]
        });

        if (connection) {
            return res.status(200).json({
                success: true,
                status: 'connected',
                connection
            });
        }

        // Check if there's a pending request
        const request = await ConnectionRequest.findOne({
            $or: [
                { fromUser: userId, toUser: targetUserId },
                { fromUser: targetUserId, toUser: userId }
            ],
            status: 'pending'
        });

        if (request) {
            const status = request.fromUser.toString() === userId.toString() ? 'request_sent' : 'request_received';
            return res.status(200).json({
                success: true,
                status,
                request
            });
        }

        // No connection or request
        res.status(200).json({
            success: true,
            status: 'not_connected'
        });

    } catch (error) {
        console.error('Get connection status error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Remove connection
export const removeConnection = async (req, res) => {
    try {
        const userId = req.userId;
        const { connectionId } = req.params;

        // Find and delete the connection
        const connection = await Connection.findOneAndDelete({
            _id: connectionId,
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        });

        if (!connection) {
            return res.status(404).json({
                success: false,
                error: "Connection not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Connection removed successfully"
        });

    } catch (error) {
        console.error('Remove connection error:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};
