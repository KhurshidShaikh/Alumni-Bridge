import mongoose from "mongoose"
const connectionSchema  =mongoose.Schema({
    _id: ObjectId,
    sender: { type: ObjectId, ref: 'User' },
    receiver: { type: ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: Date,
    updatedAt: Date
   })

export const connection=mongoose.model('connection',connectionSchema)