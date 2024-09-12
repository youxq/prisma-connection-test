# Prisma Connection Test

This repository aims to test and compare the behavior of Prisma Client using different query engines under constrained CPU resources. Specifically, it evaluates the performance and error handling of an application using a new `libquery_engine.so` versus one without it, by limiting the CPU usage to 0.1.

## Prerequisites

Make sure you have the following installed:

1. Docker
2. Docker Compose

## How to Run

To build and run the services:
```sh
docker compose --compatibility up --build -d
```
## Viewing Logs
To view the logs of the application without `libquery_engine.so` (`app-old`):
```
docker logs app-old
```
To view the logs of the application with `libquery_engine.so` (`app-new`):
```
docker logs app-new
```
## Expected Results
- `app-old` is expected to encounter errors like:
  - `Can't reach database server at postgres:5432` or
  - `Timed out fetching a new connection from the connection pool.`
- `app-new` should perform the queries without errors, demonstrating improved behavior using `libquery_engine.so`.