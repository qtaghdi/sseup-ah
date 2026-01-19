import {z} from "zod";

export const ErrorResponseParsedSchema = z.object({
    message: z.string(),
    status: z.number(),
});

export type ErrorResponseParsed = z.infer<typeof ErrorResponseParsedSchema>;