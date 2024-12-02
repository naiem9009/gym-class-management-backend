import moment from 'moment';
import ClassSchedule from '../models/ClassSchedule';


const validateClassSchedule = async (date: Date, startTime: string, trainerId: string, id?: null | string): Promise<boolean> => {
    // Check already 5 schedules on the same day

    if (!id) {
        const schedulesOnSameDay = await ClassSchedule.find({
            date: { $gte: moment(date).startOf('day').toDate(), $lt: moment(date).endOf('day').toDate() },
        });

        if (schedulesOnSameDay.length >= 5) {
            throw new Error('Max 5 schedules can be created per day.');
        }
    }

    // check class duration
    const endTime = moment(startTime, 'HH:mm').add(2, 'hours');
    const duration = endTime.diff(moment(startTime, 'HH:mm'), 'minutes');
    
    if (duration > 120) {
        throw new Error('Class duration cannot exceed 2 hours.');
    }

    // Check trainer already has a class scheduled
    const trainerSchedules = await ClassSchedule.findOne({
        trainer: trainerId,
        date: {
            $gte: moment(date).startOf('day').toDate(),
            $lt: moment(date).endOf('day').toDate(),
        },
        startTime,
        ...(id && { _id: { $ne: id } }), 
    });

    if (trainerSchedules) {
        throw new Error('Trainer already has a class scheduled at this time.');
    }

    return true;
};

export default validateClassSchedule;
