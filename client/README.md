# CHECK24 GenDev Betting Challenge
Hello and welcome to my submission for the GenDev 2024! I hope you like what I’ve developed! :)

## Overview
The app allows users to bet on the outcomes of the UEFA European Championship 2024 games, providing real-time updates on user standings and leaderboards within communities and the entire tournament. Users can create and join communities, view dynamic leaderboards, and see live updates as goals are scored or games end.

## Completed Requirements ✔️
#### Communities
* Users can create or join communities.
* Users can be members of up to 5 communities.
* Display leaderboards for each community.
* Display a global leaderboard for the entire tournament.
* Users can pin friends in the leaderboards.

#### Leaderboards
* Show username, points, and rank.
* User search function.
* Pagination of leaderboards with a flexible number of users per page (default: 10).
* Dynamic real-time updates of the leaderboards.
* Sneak preview of leaderboards on the dashboard.

#### Betting
* Betting on game results until the game starts.


#### Real-time Updates
* Live updates of the leaderboards when goals are scored or games end.
* Admin can manually update game results without restarting the application.

#### Dashboard
* Display the current standings and upcoming games.
* Sneak preview of community and global leaderboards.

#### Data Persistence
* Store users, communities, bets, and games in a database.
* Data should persist after a restart.

#### Additional Features
Points System for Betting
* 8 points for the exact result.
* 6 points for the correct goal difference (non-draws).
* 4 points for the correct tendency.
* 0 points for everything else.

## Completed Additional ideas ✔️
* The admin can create new games
* Login and Registration
* Horizontal scaling using Nginx and pgpool load balancer for NextJs and Postgres
* Loading tables in memory with materialized views

## More Optimazation Ideas ✖️
* Precalculation of the points and ranks before of a goal happens on either side
* Let Vercel scale my Application 💸 💸 💸
* Let Amazon scale my Database 💸 💸 💸 
* Optimize my SQL queries
* Redis Cache to take load from pgpool


# How to test the application by yourself

### Production

To build the application in production mode, you need following programs installed on your machine:
* [Docker (and Docker Compose)](https://www.docker.com/products/docker-desktop/)
* [Node.js](https://nodejs.org/en/)
* [yarn v4](https://yarnpkg.com/getting-started/install)

First, set all necessary environment variables in the `.env` file. You can use the `.env.example` file as a template.

Then, build the containers by running:
```bash
docker-compose --env-file .env up
```

Now the application is running.

To initialize the database, navigate to the 'client' directory, set your database password in the `.env.generate_db`
file and rename it to `.env`. Then run the following commands:

```bash
yarn install
prisma generate
prisma db push
```

The database should now be running. Please restart the application containers to
ensure that all views are created correctly.


### Development

For development, navigate to the client folder and set all environment variables in the `.env` file.
You can use the `.env.example` file as a template.

Start the test database via:

```bash
docker-compose -f docker-compose-dev.yml --env-file .env up
```

After that install all your pages and init your database by running:
```bash
yarn install
prisma generate
prisma db push
```

To start development finally run:

```bash
yarn run dev
```
# Link to my Videos

You can find videos that explain my application in action under [this link](https://drive.google.com/drive/folders/1J6ILK_SmLaqJWlurSDVhwLedI9sHc_Cl?usp=drive_link).
