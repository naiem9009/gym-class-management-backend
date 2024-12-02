import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'trainer' | 'trainee';
    specialization?: string
}

const UserSchema = new Schema<IUser>({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'trainer', 'trainee'], 
        required: true 
    },
    specialization : {
        type: String
    }
}, {
    timestamps : true
});

export default mongoose.model<IUser>('User', UserSchema);
