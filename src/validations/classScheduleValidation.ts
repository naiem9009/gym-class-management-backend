import { z } from "zod";
import {Types} from "mongoose"

// schedule Validation
export const scheduleSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
        message: "Invalid time format (expected HH:mm or HHmm)",
    }),
    trainerId: z.string().nonempty(),
    className: z.string().min(1, { message: "Class name cannot be empty" }),
});