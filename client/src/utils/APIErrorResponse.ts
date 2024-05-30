import {NextResponse} from "next/server";
import {StatusCodes} from "http-status-codes";

export class APIErrorResponse extends NextResponse {
    constructor() {
        super()
    }

    public static return_error(message: string, status: StatusCodes) {
        return super.json(
            {
                timestamp: Date.now(),
                status: status,
                error: status.toString(),
                message: message,
            },
            {
                status: status.valueOf(),
            });
    }
}