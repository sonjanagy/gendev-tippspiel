import {NextResponse} from 'next/server';
import {z} from "zod";
import * as argon2 from "argon2";
import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import { Prisma } from '@prisma/client';

const R_User = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
})
export type User = z.infer<typeof R_User>;

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    const body = await request.json();
    const user_to_insert: User = R_User.parse(body);
    if (await prisma.user.findFirst(
        {
            where: {
                OR: [
                    {username: user_to_insert.username},
                    {email: user_to_insert.email}
                ]
            }
        },
    ) !== null) {
        return APIErrorResponse.return_error("User already exists", StatusCodes.BAD_REQUEST);
    }
    const salt = crypto.randomUUID();
    console.log("Password", user_to_insert.password, salt);
    user_to_insert.password = await argon2.hash(user_to_insert.password + salt);
    await prisma.user.create(
        {
            data: {
                username: user_to_insert.username,
                email: user_to_insert.email,
                password: user_to_insert.password,
                salt: salt,
                updatedAt: new Date(),
            }
        }
    )

    const updateAll = Prisma.sql`
    REFRESH MATERIALIZED VIEW rank_all;`
    const res2 = await prisma.$queryRaw(updateAll)

    return NextResponse.json("User was inserted successfully.");
}
