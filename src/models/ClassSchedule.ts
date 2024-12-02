import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IClassSchedule extends Document {
    date: Date;
    startTime: string;
    endTime: string;
    trainer: IUser;
    maxParticipants: number;
    participants: IUser[];
    className : string;
}

const ClassScheduleSchema = new Schema<IClassSchedule>({
    date: { 
        type: Date, 
        required: true 
    },
    startTime: { 
        type: String, 
        required: true 
    },
    endTime: { 
        type: String, 
        required: true 
    },
    trainer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    maxParticipants: { 
        type: Number, 
        default: 10 
    },
    className : {
        type : String,
        required: true,
    },
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
}, {
    timestamps : true
});

export default mongoose.model<IClassSchedule>('ClassSchedule', ClassScheduleSchema);
