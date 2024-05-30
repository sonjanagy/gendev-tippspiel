import {z} from "zod";

export const Z_User = z.object({
    username: z.string(),
    userId: z.number(),
    password: z.string()
})

export type User = z.infer<typeof Z_User>;