import {Prisma, PrismaClient} from "@prisma/client";


const prisma = new PrismaClient()

export async function register() {

    const createViwe_all = Prisma.sql`
    create materialized view rank_all as
SELECT u."userId",
       u.username,
       u."totalPoints",
       u."createdAt",
       rank() OVER (ORDER BY "totalPoints" DESC) AS rank
FROM "User" u;

alter materialized view rank_all owner to postgres;

REFRESH MATERIALIZED VIEW rank_all;

create index rank_a_rank_idx
    on rank_all (rank);

create index rank_a_rank_createdAt_idx
    on rank_all ("rank", "createdAt");`


    const createViwe_Comm = Prisma.sql`
    create materialized view rank_communities as
SELECT u."userId",
       u.username,
       u."totalPoints",
       u."createdAt",
       h."communityId",
       rank() OVER (PARTITION BY "communityId" ORDER BY "totalPoints" DESC) AS rank
FROM "User" u
         JOIN has h USING ("userId");


alter materialized view rank_communities owner to postgres;

REFRESH MATERIALIZED VIEW rank_communities;

create index rank_c_rank_idx
    on rank_communities (rank);

create index rank_c_community_idx
    on rank_communities ("communityId");

create index rank_c_rank_createdAt_idx
    on rank_communities ("rank", "createdAt");`


    const createViwe_Comm_Friends = Prisma.sql`
    create materialized view rank_communities_friends as
SELECT u."userId",
       u.username,
       u."totalPoints",
       u."createdAt",
       c."communityId",
       h."userId" as aktUserId,
       rank() OVER (PARTITION BY "communityId" ORDER BY "totalPoints" DESC) AS rank
FROM "User" u
         JOIN has c USING ("userId")
        JOIN "IsFriendOf" h ON (h."friendOfUserId" = u."userId");

alter materialized view rank_communities_friends owner to postgres;

REFRESH MATERIALIZED VIEW rank_communities_friends;

create index rank_c_f_rank_idx
    on rank_communities_friends (rank);

create index rank_c_f_community_idx
    on rank_communities_friends ("communityId");

create index rank_c_f_rank_createdAt_idx
    on rank_communities_friends ("rank", "createdAt");

create index rank_c_f_friends_idx
    on rank_communities_friends (aktUserId);`


    const res_all = await prisma.$queryRaw(createViwe_all)
    const res_Comm = await prisma.$queryRaw(createViwe_Comm)
    const res_Comm_Friends = await prisma.$queryRaw(createViwe_Comm_Friends)



}
