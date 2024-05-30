-- CreateEnum
CREATE TYPE "Status" AS ENUM ('STOP', 'RUNNING', 'END', 'HALFTIME', 'INTERRUPT');

-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('FIRST', 'SECOND', 'OVERTIMEFIRST', 'OVERTIMESECOND', 'PENALTY');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "IsFriendOf" (
    "userId" INTEGER NOT NULL,
    "friendOfUserId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IsFriendOf_pkey" PRIMARY KEY ("friendOfUserId","userId")
);

-- CreateTable
CREATE TABLE "Community" (
    "communityId" SERIAL NOT NULL,
    "communityname" TEXT NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("communityId")
);

-- CreateTable
CREATE TABLE "Game" (
    "gameId" SERIAL NOT NULL,
    "scoreHometeam" INTEGER NOT NULL,
    "scoreAwayteam" INTEGER NOT NULL,
    "startTime" TIME NOT NULL,
    "date" DATE NOT NULL,
    "beginStart" TIMESTAMP,
    "beginStop" TIMESTAMP,
    "state" "Status" NOT NULL,
    "phase" "Phase",
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hometeamId" INTEGER NOT NULL,
    "awayteamId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("gameId")
);

-- CreateTable
CREATE TABLE "Team" (
    "teamId" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "has" (
    "communityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "has_pkey" PRIMARY KEY ("communityId","userId")
);

-- CreateTable
CREATE TABLE "Betting" (
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "scoreAwayteam" INTEGER NOT NULL,
    "scoreHometeam" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Betting_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Community_communityname_key" ON "Community"("communityname");

-- CreateIndex
CREATE UNIQUE INDEX "Team_country_key" ON "Team"("country");

-- AddForeignKey
ALTER TABLE "IsFriendOf" ADD CONSTRAINT "IsFriendOf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsFriendOf" ADD CONSTRAINT "IsFriendOf_friendOfUserId_fkey" FOREIGN KEY ("friendOfUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hometeamId_fkey" FOREIGN KEY ("hometeamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayteamId_fkey" FOREIGN KEY ("awayteamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has" ADD CONSTRAINT "has_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("communityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has" ADD CONSTRAINT "has_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Betting" ADD CONSTRAINT "Betting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Betting" ADD CONSTRAINT "Betting_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
