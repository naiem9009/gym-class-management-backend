import express from 'express';
import verifyJWT from '../middlewares/verifyJWT';
import checkRole from '../middlewares/checkRole';
import trainerController from '../controllers/trainerController';
const router = express.Router();


// get all trainer
router.get("/", verifyJWT, checkRole(["admin"]), trainerController.fetchTrainers)

// update trainer
router.put("/update/:id", verifyJWT, checkRole(["admin"]), trainerController.updateTrainer)

// add trainer 
router.post("/create", verifyJWT, checkRole(['admin']), trainerController.addTrainer)

// delete trainer 
router.delete("/delete/:id", verifyJWT, checkRole(["admin"]), trainerController.deleteTrainer)






export default router;