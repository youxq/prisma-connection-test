# Prisma Connection Pool Demonstration

This project demonstrates Prisma's connection pool behavior when connections are idle for 5 minutes. It showcases how Prisma manages and recreates connections rather than reusing old ones after a period of inactivity.

## Prerequisites

Make sure you have the following installed:

1. Docker
2. Node.js (v20.12.1)
3. yarn

## Project Setup

### 1. Clone the Repository

```sh
git clone https://github.com/youxq/prisma-connection-test.git
cd prisma-connection-test
```

### 2. Install Dependencies

```
yarn install
```

### 3. Set Up PostgreSQL with Docker

Use the following command to set up a PostgreSQL instance:

```
docker run --name prisma-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres:14.13
```

### 4. Configure Environment Variables
Create a `.env` file in the project root with the following content:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test?schema=public&connection_limit=10"
```

### 5. Set Up Prisma
Generate the Prisma client by running:
```
yarn generate
```

## Running the Code
To start the demonstration, run:
```
yarn dev
```
This script will:

1. Create users concurrently.
2. Print connection metrics.
3. Sleep for 5 minutes.
4. Query users concurrently.
5. Print updated connection metrics.
6. Repeat the sleep and query cycle indefinitely.

## Expected Output
Upon running the script, you should expect output similar to this:
```
Created new users total:  11
prisma_pool_connections_closed_total: 0
prisma_pool_connections_opened_total: 9
prisma_pool_connections_idle: 9
prisma_pool_connections_open: 9
Sleeping for 5 minutes...
Queried users total:  11
prisma_pool_connections_closed_total: 9
prisma_pool_connections_opened_total: 19
prisma_pool_connections_idle: 19
prisma_pool_connections_open: 10
```
## Detailed Explanation
- **Create Users Concurrently**: The script creates 11 users in parallel.
- **Print Connection Metrics**: It prints the initial connection pool metrics.
- **Sleep for 5 Minutes**: The script sleeps for 5 minutes to allow connections to become idle.
- **Query Users Concurrently**: After 5 minutes, the script queries the users in parallel.
- **Print Updated Connection Metrics**: It prints the connection pool metrics again to show the changes.
- **Loop**: The script repeats this process indefinitely.

The key observation is that after the 5-minute sleep, Prisma closes and reopens the connections instead of reusing the old ones.