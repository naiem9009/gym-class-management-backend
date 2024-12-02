import { Request, Response } from 'express';
import ClassSchedule from '../models/ClassSchedule';
import User, { IUser } from '../models/User';
import validateClassSchedule from '../utils/validateClassSchedule';
import moment from 'moment';
import { scheduleSchema } from '../validations/classScheduleValidation';
import { RequestWithUser } from '../middlewares/verifyJWT';
import { JwtPayload } from 'jsonwebtoken';
// export interface AuthenticatedRequest extends Request {
//     user?: IUser
// }

class ClassScheduleController {
    // create class schedule
    async createClassSchedule(req: RequestWithUser<{user?: unknown | IUser}>, res: Response): Promise<void> {

        try {

            console.log(req.body);
            const scheduleValidateData = scheduleSchema.parse(req.body)

            const {className, date, startTime, trainerId} = scheduleValidateData

            // Validate class schedule
            await validateClassSchedule(date as unknown as Date, startTime, trainerId, null);

            // Check trainer validity
            const trainer = await User.findById(trainerId);
            if (!trainer || trainer.role !== 'trainer') {
                res.status(400).json({ success: false, message: 'Invalid trainer.' });
                return;
            }

            // Create new class
            const newClass = new ClassSchedule({
                date,
                startTime,
                className,
                endTime: moment(startTime, 'HH:mm').add(2, 'hours').format('HH:mm'),
                trainer: trainerId,
                participants: [],
            });

            await newClass.save();

            const saveData = await ClassSchedule.findById(newClass._id).populate('trainer', 'name email role')

            res.status(201).json({
                success: true,
                message: 'Class scheduled successfully.',
                data: saveData,
            });

        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error scheduling class.',
            });
        }
    }

    // update schedule
    async updateClassSchedule(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            console.log(req.body);
            
    
            // Validate data
            const scheduleValidateData = scheduleSchema.parse(req.body);
            const { className, date, startTime, trainerId } = scheduleValidateData;
    
            // Find class schedule by id
            const existingClass = await ClassSchedule.findById(id);
            if (!existingClass) {
                res.status(404).json({ success: false, message: 'Class schedule not found.' });
                return;
            }
    
            // Validate updated schedule
            await validateClassSchedule(date as unknown as Date, startTime, trainerId, id);
    
            // Check trainer validity
            const trainer = await User.findById(trainerId);
            if (!trainer || trainer.role !== 'trainer') {
                res.status(400).json({ success: false, message: 'Invalid trainer.' });
                return;
            }
    
            // Update class schedule
            existingClass.className = className;
            existingClass.date = date as unknown as Date;
            existingClass.startTime = startTime;
            existingClass.endTime = moment(startTime, 'HH:mm').add(2, 'hours').format('HH:mm');
            existingClass.trainer = trainerId as unknown as IUser;
    
            await existingClass.save();
            const updatedData = await ClassSchedule.findById(existingClass._id).populate('trainer', 'name email role');
    
            res.status(200).json({
                success: true,
                message: 'Class schedule updated successfully.',
                data: updatedData,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error updating class schedule.',
            });
        }
    }

    async bookClass(req: RequestWithUser<{user?: any | JwtPayload}>, res: Response): Promise<void> {
        if (req.user?.role !== 'trainee') {
            res.status(403).json({ success: false, message: 'Unauthorized access. Only trainees can book classes.' });
            return;
        }

        const { classScheduleId } = req.body;

        try {
            const classSchedule = await ClassSchedule.findById(classScheduleId);
            if (!classSchedule) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Class not found.' 
                });
                return;
            }

            if (classSchedule.participants.length >= classSchedule.maxParticipants) {
                res.status(400).json({
                    success: false,
                    message: 'Class schedule is full. Maximum 10 trainees allowed per schedule.',
                });
                return;
            }

            // Check if the trainee is already a participant
            if (classSchedule.participants.includes(req.user.id)) {
                res.status(400).json({
                    success: false,
                    message: 'You have already booked this class.',
                });
                return;
            }

            // Add trainee to the class participants
            classSchedule.participants.push(req.user.id);
            await classSchedule.save();

            res.status(201).json({
                success: true,
                message: 'Class booked successfully.',
                data: classSchedule,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error booking the class.',
                error: error.message,
            });
        }
    }


    async getAllClassSchedule (req: Request, res: Response) : Promise<any> {
        try {

            const schedules = await ClassSchedule.find()
              .populate('trainer', 'name email role')
              
            res.status(200).json({ success: true, schedules });
          } catch (error) {
            console.error('Error fetching schedules:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch schedules', error });
        }
    }

    // get today class
    async getTodayClassSchedule (req: Request, res: Response) : Promise<void> {
        try {
            const startOfDay = moment().startOf('day').toDate();
            const endOfDay = moment().endOf('day').toDate();

            const todaySchedules = await ClassSchedule.find({
                date: { $gte: startOfDay, $lt: endOfDay },
            }).populate('trainer', 'name email role'); 
    
            res.status(200).json({
                success: true,
                message: 'Today\'s class schedules fetched successfully.',
                data: todaySchedules,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching today\'s schedules.',
            });
        }
    }


    // remove schedule
    async removeSchedule (req: Request, res: Response) : Promise<void> {
        try {
            const { id } = req.params;
            const deletedSchedule = await ClassSchedule.findByIdAndDelete(id);
    
            if (!deletedSchedule) {
                res.status(404).json({
                    success: false,
                    message: 'Schedule not found.',
                });
                return;
            }
    
            res.status(200).json({
                success: true,
                message: 'Schedule deleted successfully.',
                _id: id,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while deleting the schedule.',
            });
        }
    }

    // get available class schedule
    async getAvailableClassSchedule(req: RequestWithUser<{user?: any | JwtPayload}>, res: Response): Promise<void> {
        try {
            const user = req.user; 
            const today = moment().startOf('day').toDate();
    
            const availableClasses = await ClassSchedule.find({
                date: { $gte: today },
                'participants.9': { $exists: false },
            }).populate('trainer', 'name email role').exec();
    
            const filteredClasses = availableClasses.filter(classItem => 
                !classItem.participants.includes(user?.id)
            );
            
    
            const finalFilteredClasses = await Promise.all(
                filteredClasses.filter(async (classItem) => {
                    const trainerAlreadyBooked = await ClassSchedule.exists({
                        trainer: user?.id,
                        date: classItem.date,
                        startTime: classItem.startTime,
                        _id: { $ne: classItem._id },
                    });
                    return !trainerAlreadyBooked;
                })
            );
    
            res.status(200).json({
                success: true,
                message: 'Available classes fetched successfully.',
                data: finalFilteredClasses,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch available classes.',
            });
        }
    }


    async getTraineeSchedule(req: Request, res: Response): Promise<void> {
        try {
            const { traineeId } = req.params;
    
            if (!traineeId) {
                res.status(400).json({
                    success: false,
                    message: 'Trainee ID is required.',
                });
                return;
            }
    
            // get all classes where the trainee is a participant
            const traineeClasses = await ClassSchedule.find({
                participants: traineeId,
            }).populate('trainer', 'name email role').exec();
    
            res.status(200).json({
                success: true,
                message: 'Trainee schedule fetched successfully.',
                data: traineeClasses,
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch trainee schedule.',
            });
        }
    }


    // get trainer schedule
    async getTrainerSchedule(req: Request, res: Response): Promise<void> {
        try {
            const { trainerId } = req.params;
    
            if (!trainerId) {
                res.status(400).json({
                    success: false,
                    message: 'Trainee ID is required.',
                });
                return;
            }
    
            // get all classes where the trainee is a participant
            const trainerClasses = await ClassSchedule.find({
                trainer: trainerId,
            }).populate('participants', 'name email').exec();
    
            res.status(200).json({
                success: true,
                message: 'Trainer schedule fetched successfully.',
                data: trainerClasses,
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch trainee schedule.',
            });
        }
    }
}

export default new ClassScheduleController();
