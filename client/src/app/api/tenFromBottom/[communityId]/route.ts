import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/client";
import {Prisma} from "@prisma/client";
import {z} from "zod";

export const dynamic = 'force-dynamic'

interface UserWithRank {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
}

const RankedUsers = z.object({
    communityId: z.number().or(z.string()).transform(Number)
})

type RankedUsers = z.infer<typeof RankedUsers>;

export async function GET(request: NextRequest,{ params } : { params : {communityId: string } }) {

    const user_to_get: RankedUsers = RankedUsers.parse(params);

    const searchparams = request.nextUrl.searchParams
    const queryParams = searchparams.get("offset")

    console.log("queryParams")
    console.log(queryParams)



    const offsetAsNumber = 1 + 10 * Number(queryParams);

    const query = Prisma.sql`
        with "rank_community" as (SELECT * FROM rank_communities where "communityId" = ${user_to_get.communityId})

        SELECT final."userId", final.username, final."totalPoints", final.rank
        FROM (SELECT *
              FROM (SELECT *
                    FROM "rank_community" r
                    ORDER BY r.rank DESC, r."createdAt" DESC
                    OFFSET ${offsetAsNumber} LIMIT 10) as "r") as "final"

        ORDER BY final.rank, final."createdAt"`



    const result_with_bigint: UserWithRank[] = await prisma.$queryRaw(query)
    const result = result_with_bigint.map(el => ({...el, rank: Number(el.rank)}))


    return NextResponse.json(result)
}
