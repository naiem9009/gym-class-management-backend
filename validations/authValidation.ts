import { z } from 'zod';


// login validation
export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

// register validation
export const registerSchema = z.object({
    fullName: z.string().trim().min(3, { message: "Name must be at least 3 characters long." }),
    email: z.string().email({ message: "Invalid email address." }).trim(),
    password: z.string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, { message: "Password must be less than 100 characters long." })
})


// trainer validation
export const trainerSchema = z.object({
    name: z.string().trim().min(3, { message: "Name must be at least 3 characters long." }),
    specialization: z.string().trim().min(3, { message: "Specialization must be at least 2 characters long." }),
    email: z.string().email({ message: "Invalid email address." }).trim(),
    password: z.string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, { message: "Password must be less than 100 characters long." })
})

