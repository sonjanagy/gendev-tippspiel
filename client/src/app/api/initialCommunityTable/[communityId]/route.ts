import prisma from "@/utils/client";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {Prisma} from '@prisma/client'
import {verifyJwtToken} from "@/utils/authHelper";

const Community = z.object({
    communityId: z.number().or(z.string()).transform(Number)
})

type Community = z.infer<typeof Community>;

export const dynamic = 'force-dynamic'
interface UserWithRank {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
}

export async function GET(request: NextRequest, {params}: { params: { gameId: string } }) {

    const community_to_load: Community = Community.parse(params);

    const token = request.cookies.get('token');

    if (token === null || token === undefined) {
        return APIErrorResponse.return_error("token does not exist", StatusCodes.BAD_REQUEST);
    }
    const payload = await verifyJwtToken(token.value);

    if (payload === null) {
        return APIErrorResponse.return_error("payload does not exist", StatusCodes.BAD_REQUEST);
    }


    const query = Prisma.sql`
        with "rank_community" as (SELECT * FROM rank_communities_friends where "communityId" = ${community_to_load.communityId}),
     "friends_of_akt" as (SELECT * FROM rank_communities_friends where "aktuserid" = ${payload.userId as number} and "communityId" = ${community_to_load.communityId})

SELECT final."userId", final.username, final."totalPoints", final.rank
FROM (SELECT *
      FROM (SELECT * FROM "rank_community" r ORDER BY r.rank, r."createdAt" LIMIT 3) as "r"

      UNION ALL

      SELECT *
      FROM "rank_community" r
      WHERE r."userId" = ${payload.userId as number}

      UNION ALL

          SELECT *
          FROM friends_of_akt

      UNION ALL

      SELECT *
      FROM (SELECT * FROM "rank_community" h ORDER BY h.rank DESC, h."createdAt" DESC LIMIT 1) as "temp"
     ) as "final"

ORDER BY final.rank, final."createdAt"`

    const result_with_bigint: UserWithRank[] = await prisma.$queryRaw(query)

    console.log("result_with_bigint" + result_with_bigint)

    const result = result_with_bigint.map(el => ({...el, rank: Number(el.rank)}))

    const removedopes = result.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.userId === value.userId
            ))
    )

    const index = removedopes.findIndex(e => e.userId === payload.userId as number)


    if(removedopes.length <=7){
        return NextResponse.json(removedopes)
    }
    if(index <= 5){
        const array = removedopes.slice(0, 6)
        array.push(removedopes[removedopes.length - 1])
        console.log("this is the beginning")
        console.log(array)
        return NextResponse.json(array)
    }
    else if(index >= removedopes.length-1-2){
        const array = removedopes.slice(0, 3).concat(removedopes.slice(removedopes.length-1-3, removedopes.length))
        console.log("this is the end")
        console.log(array)
        return NextResponse.json(array)
    }
    else{
        const array = removedopes.slice(0, 3)
        array.push(removedopes[index-1])
        array.push(removedopes[index])
        array.push(removedopes[index+1])
        array.push(removedopes[removedopes.length - 1])
        console.log("this is the middle")
        console.log(array)
        return NextResponse.json(array)
    }

    return NextResponse.json("")

}
