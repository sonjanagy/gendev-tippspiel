import prisma from "@/utils/client";
import {z} from "zod";
import * as argon2 from "argon2";
import {APIErrorResponse} from '@/utils/APIErrorResponse';
import {StatusCodes} from "http-status-codes";
import {NextResponse} from "next/server";
import {SignJWT} from "jose";
import { getJwtSecretKey, setUserDataCookie } from '@/utils/authHelper';
import {I_UserPublic} from "@/utils/authHelper";

const User = z.object({
    username: z.string(),
    password: z.string()
})

export const dynamic = 'force-dynamic'

type User = z.infer<typeof User>;

declare interface ApiResponse {
    success: boolean;
    message?: string;
}

export interface I_ApiUserLoginResponse extends ApiResponse {}


export async function POST(request: Request) {

    const body = await request.json();
    const user_to_get: User = User.parse(body);

    const user = await prisma.user.findFirst(
        {
            where: {
                username: user_to_get.username,
            }
        }
    )

    if (user === null) {
        return APIErrorResponse.return_error("Username or Password incorrect", StatusCodes.BAD_REQUEST);
    }
    if (!await argon2.verify(user.password, user_to_get.password + user.salt)) {
        return APIErrorResponse.return_error("Username or Password incorrect", StatusCodes.BAD_REQUEST);
    }

    const token = await new SignJWT({
        username: user.username,
        userId: user.userId,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${86400}s`)
        .sign(getJwtSecretKey());

    const res: I_ApiUserLoginResponse = {
        success: true,
    };

    const response = NextResponse.json(res);

    response.cookies.set({
        name: 'token',
        value: token,
        path: '/', // Accessible site-wide
        maxAge: 86400, // 24-hours or whatever you like
        httpOnly: true, // This prevents scripts from accessing
        sameSite: 'strict', // This does not allow other sites to access
    });



    // Store public user data as a cookie
    const userData: I_UserPublic = {
        username: user.username,
        userId: user.userId
    };
    setUserDataCookie(userData);

    return response;
}
