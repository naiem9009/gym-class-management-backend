import express from 'express';
import classScheduleController from '../controllers/classScheduleController';
import verifyJWT from '../middlewares/verifyJWT';
import checkRole from '../middlewares/checkRole';

const router = express.Router();

// Admin creates class schedule
router.post('/create', verifyJWT, checkRole(["admin"]), classScheduleController.createClassSchedule);

// Trainee books class
router.post('/book', verifyJWT, checkRole(['trainee']), classScheduleController.bookClass);

router.get('/schedules/trainee/:traineeId', verifyJWT, checkRole(["trainee"]), classScheduleController.getTraineeSchedule);

router.get('/schedules/trainer/:trainerId', verifyJWT, checkRole(["trainer"]), classScheduleController.getTrainerSchedule);

// get available classes
router.get("/available", verifyJWT, checkRole(['trainee']) , classScheduleController.getAvailableClassSchedule)

// get today class schedule
router.get('/schedules/today', classScheduleController.getTodayClassSchedule);

router.get('/schedules', verifyJWT, checkRole(["admin"]), classScheduleController.getAllClassSchedule);

// update schedule
router.put("/schedules/update/:id", verifyJWT, checkRole(["admin"]), classScheduleController.updateClassSchedule)
router.delete("/schedules/delete/:id", verifyJWT, checkRole(["admin"]), classScheduleController.removeSchedule)


export default router;
