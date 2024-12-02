import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs"
import { trainerSchema } from "../validations/authValidation";




class TrainerController {
    // add trainer (admin)
    async addTrainer (req: Request, res: Response) : Promise<any> {
      
        try {

            const validatedData = trainerSchema.parse(req.body);
            const {email, name, password, specialization} = validatedData


            const existUser = await User.findOne({email})

            if (existUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered"
                })
            }

            // Hash password 
            const hashedPassword = await bcrypt.hash(password, 10);
                
            const newTrainer = new User({
                name,
                email,
                password: hashedPassword,
                role : "trainer",
                specialization
            });
      
            const savedTrainer = await newTrainer.save();
            res.status(201).json(savedTrainer); 
        } catch (error) {
            res.status(500).json({ message: 'Failed to add trainer', error });
        }
    };



    // get all trainers (admin)
    async fetchTrainers (req: Request, res: Response) : Promise<any> {
        try {
            const trainers = await User.find({ role: 'trainer' }).sort({createdAt: "desc"});

            res.status(200).json(trainers);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch trainers' });
        }
    }


    // update trainer (admin)
    async updateTrainer (req: Request, res: Response) : Promise<any> {
        const { id } = req.params;     
        
        console.log(id);
        
        try {

            
            const {email, name, password, specialization} = req.body

            // Hash password 
            const hashedPassword = await bcrypt.hash(password, 10);

            const existTrainer = await User.findById(id);

            if (!existTrainer) return res.status(404).json({
                success: false,
                message : "Trainer not found"
            })

            const trainer = await User.findByIdAndUpdate(id, {
                email, 
                name, 
                password : password ? hashedPassword : existTrainer.password, 
                specialization
            }, { new: true });

            
            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
        
            res.status(200).json(trainer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update trainer' });
        }
    }

    // delete trainer (admin)
    async deleteTrainer (req: Request, res: Response) : Promise<any> {
        const { id } = req.params; 

        try {
            const trainer = await User.findByIdAndDelete(id);
            if (!trainer) {
                return res.status(404).json({ success: false, message: 'Trainer not found' });
            }
        
            res.status(200).json({ success: true, _id: id, message: 'Trainer deleted successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to delete trainer' });
        }
    }
}


export default new TrainerController()


