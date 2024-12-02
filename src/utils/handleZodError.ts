import { ZodError } from "zod";

export const handleZodError = (error: unknown) => {
    if (error instanceof ZodError) {
        return error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));
    }

    return [{ message: "An unexpected error occurred." }];
};
