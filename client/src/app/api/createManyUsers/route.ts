import prisma from "@/utils/client";
import * as argon2 from "argon2";

export async function POST(request: Request){

    for (let i = 1; i < 2000001; i++) {
        await prisma.user.create(
            {
                data: {
                    username: "user" + i,
                    email: "user" + i + "@email.com",
                    password: "passwort",
                    salt: "salt",
                    updatedAt: new Date(),
                }
            }
        )
    }
}