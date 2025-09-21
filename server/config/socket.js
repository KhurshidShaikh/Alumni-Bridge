import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';

// Store active users and their socket connections
const activeUsers = new Map();

let io;

export const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Authentication middleware for socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            console.log('🔐 Authenticating socket connection with token...');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('🔐 Decoded token:', { id: decoded.id, role: decoded.role });
            
            const user = await userModel.findById(decoded.id).select('-password');
            console.log('🔐 User lookup result:', user ? 'Found' : 'Not found');
            
            if (!user) {
                console.error('❌ User not found for ID:', decoded.id);
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user._id.toString();
            socket.user = user;
            console.log('✅ Socket authenticated for user:', user.name);
            next();
        } catch (error) {
            console.error('❌ Socket authentication error:', error);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User ${socket.user.name} connected with socket ID: ${socket.id}`);
        
        // Store user's socket connection
        activeUsers.set(socket.userId, {
            socketId: socket.id,
            user: socket.user,
            lastSeen: new Date()
        });

        // Join user to their personal room for notifications
        socket.join(`user_${socket.userId}`);

        // Emit online status to connections
        socket.broadcast.emit('userOnline', {
            userId: socket.userId,
            user: {
                _id: socket.user._id,
                name: socket.user.name,
                profile: socket.user.profile
            }
        });

        // Handle joining conversation rooms
        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`🏠 User ${socket.user.name} (${socket.userId}) joined conversation room: ${conversationId}`);
            console.log(`🏠 Socket ${socket.id} is now in rooms:`, Array.from(socket.rooms));
        });

        // Handle leaving conversation rooms
        socket.on('leaveConversation', (conversationId) => {
            socket.leave(conversationId);
            console.log(`User ${socket.user.name} left conversation: ${conversationId}`);
        });

        // Handle typing indicators
        socket.on('typing', ({ conversationId, isTyping }) => {
            socket.to(conversationId).emit('userTyping', {
                userId: socket.userId,
                user: {
                    _id: socket.user._id,
                    name: socket.user.name
                },
                isTyping
            });
        });

        // Handle message read receipts
        socket.on('markAsRead', ({ conversationId, userId }) => {
            // Notify the other user in the conversation that messages have been read
            socket.to(conversationId).emit('messagesRead', { conversationId, readBy: userId });
            console.log(`📣 User ${socket.user.name} marked conversation ${conversationId} as read.`);
        });

        // Handle user going offline
        socket.on('disconnect', () => {
            console.log(`User ${socket.user.name} disconnected`);
            
            // Remove user from active users
            activeUsers.delete(socket.userId);
            
            // Emit offline status to connections
            socket.broadcast.emit('userOffline', {
                userId: socket.userId,
                lastSeen: new Date()
            });
        });

        // Handle connection errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return io;
};

// Export function to get io instance
export const getIO = () => io;

// Utility functions
export const getActiveUsers = () => {
    return Array.from(activeUsers.values()).map(user => ({
        userId: user.user._id,
        name: user.user.name,
        profile: user.user.profile,
        lastSeen: user.lastSeen
    }));
};

export const isUserOnline = (userId) => {
    return activeUsers.has(userId.toString());
};

export const getUserSocket = (userId) => {
    return activeUsers.get(userId.toString());
};
