import prisma from "@/utils/client";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {Prisma} from '@prisma/client'

const aktUser = z.object({
    userId: z.number().or(z.string()).transform(Number)
})

type aktUser = z.infer<typeof aktUser>;

interface UserWithRank {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
}

export async function GET(request: NextRequest, {params}: { params: { gameId: string } }) {

    const user_to_load: aktUser = aktUser.parse(params);

    const userCount = await prisma.user.count()

    const query = Prisma.sql`
        with "current_user" as (SELECT * FROM rank_all r WHERE r."userId" = ${user_to_load.userId})
        SELECT final."userId", final.username, final."totalPoints", final.rank
        FROM (SELECT *
              FROM (SELECT * FROM rank_all r ORDER BY r.rank, r."createdAt" LIMIT 6) as "r"
              UNION ALL
              SELECT *
              FROM (SELECT *
                    FROM rank_all r
                    WHERE (r.rank = (SELECT rank FROM "current_user")
                               AND r."createdAt" <= (SELECT "createdAt" FROM "current_user")
                        OR
                           r.rank < (SELECT rank FROM "current_user"))
                      AND r."userId" <> ${user_to_load.userId}
                    ORDER BY rank DESC , "createdAt" DESC
                    LIMIT 1) as "r*"
              UNION ALL
              SELECT *
              FROM rank_all r
              WHERE r."userId" = ${user_to_load.userId}
              UNION ALL
              SELECT *
              FROM (SELECT *
                    FROM rank_all r
                    WHERE (r.rank = (SELECT rank FROM "current_user")
                               AND r."createdAt" >= (SELECT "createdAt" FROM "current_user")
                        OR
                           r.rank > (SELECT rank FROM "current_user"))
                      AND r."userId" <> ${user_to_load.userId}
                    ORDER BY rank, "createdAt"
                    LIMIT 1) as "r*"
              UNION ALL
              SELECT *
              FROM (SELECT * FROM rank_all h ORDER BY h.rank DESC, h."createdAt" DESC LIMIT 4) as "temp"
             ) as "final"
        ORDER BY final.rank, final."createdAt"`

    const result_with_bigint: UserWithRank[] = await prisma.$queryRaw(query)
    console.log(result_with_bigint)

    const result = result_with_bigint.map(el => ({...el, rank: Number(el.rank)}))

    const removedopes = result.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.userId === value.userId
            ))
    )

    const index = removedopes.findIndex(e => e.userId === user_to_load.userId)
    console.log(index)

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
    /**
     * Tabelle: Case 1: User is in Place 3
     * Query always top 4
     *
     *
     *
     *
     */


    /*

        if(userCount <= 7){
            const all = await prisma.user.findMany({
                orderBy: [
                    {
                        totalPoints: 'desc',
                    },
                    {
                        createdAt: 'asc',
                    },
                ],
            })
            //return NextResponse.json(all)
        }

        const firstThree = await prisma.user.findMany({
            take: 3,
            orderBy: [
            {
                totalPoints: 'desc',
            },
            {
                createdAt: 'asc',
            },
            ],
        })
        // console.log(firstThree);

        const last = await prisma.user.findFirst({
            orderBy: [
                {
                    totalPoints: 'asc',
                },
                {
                    createdAt: 'desc',
                },
            ],
        })
        //console.log(last);

        if(last === null){
            //return  APIErrorResponse.return_error("there is no last user", StatusCodes.BAD_REQUEST);
        }

        const firstThreeIndex = firstThree.findIndex(e => e.userId === user_to_load.userId)

        if(firstThreeIndex !== -1) {
            //user ist teil von ersten 3
            const nextThree = await prisma.user.findMany({
                skip: 3,
                take: 3,
                orderBy: [
                    {
                        totalPoints: 'desc',
                    },
                    {
                        createdAt: 'asc',
                    },
                ],
            })

            const concatEverything = firstThree.concat(nextThree)

            //return NextResponse.json(concatEverything.push(last))
        }
        else if(last.userId === user_to_load.userId){
            //user ist letzter
            const lastThreeFromEnd = await prisma.user.findMany({
                skip: 1,
                take: 3,
                orderBy: [
                    {
                        totalPoints: 'asc',
                    },
                    {
                        createdAt: 'asc',
                    },
                ],
            })
            const concatEverything = firstThree.concat(lastThreeFromEnd.reverse())
            //return NextResponse.json(concatEverything.push(last))
        }
        else{
            //user ist in der mitte
            //rank: #gleicherScores & #wieViele über

            const loggedIn = await prisma.user.findFirst(
                {
                    where: {
                        userId: user_to_load.userId
                    }
                }
            )
            //if(loggedIn === null){
            //    return
            //}
            const besser = await prisma.user.findFirst({
                orderBy: [
                {
                    totalPoints: 'desc',
                },
                {
                    createdAt: 'asc',
                },
            ],
                where: {
                    AND: [{
                        totalPoints: {
                            gte: loggedIn.totalPoints
                        },
                        createdAt:{
                            lte: loggedIn.createdAt
                        }
                    }]
                }
                }
            )
            //if(besser === null){
            //    return
            //}

            console.log("TEST")

            const page = 0
            const size = 5
            const query = Prisma.sql`SELECT u."userId", u."username", u."totalPoints", RANK() OVER (ORDER BY u."totalPoints" DESC ) AS rank FROM "User" as u ORDER BY rank, u."createdAt" LIMIT ${size} OFFSET ${page * size}`

            console.log(query)
            const result = await prisma.$queryRaw(query)

            console.log(result)

            if(besser.userId === firstThree[2].userId){
                //user ist 4.bester -> 2 danach holen

            }

        }


    */

    return NextResponse.json("")

}