# imageGame
A web game involving clicking on images

## Installation and Setup
To begin, make sure that PostgreSQL is installed. If not, install it here [https://www.postgresql.org/download/] and install Postgres version 15.6. For installation on MacOS, this guide can be followed [https://www.enterprisedb.com/postgres-tutorials/installation-postgresql-mac-os], or for Windows, [https://www.geekbits.io/how-to-install-postgresql-and-pgadmin-4-on-windows/] (Postgres portion only). \\
When PostgreSQL terminal has been setup, we can run these commands to set up the database:
```bash
create database imageGame;
create table score (time float);
create table feedback (stars int);
```
These will prompt these messages:
```bash
CREATE DATABASE
CREATE TABLE
CREATE TABLE
```

To then install the necessary packages, open a new terminal and run npm install. If npm has not been installed, install it here [https://nodejs.org/en]. After the necessary packages have been installed, create a `.env` file and populate it with these lines, filling in the `POSTGRES_PASSWORD = ` line with your PostgreSQL password:
```bash 
DB_HOST = localhost
POSTGRES_USER = postgres
POSTGRES_PASSWORD = 
POSTGRES_DB = imageGame
PORT = 5432
```

## Running the Server
To then run the server, in a new terminal, run **npm start**, which will start a server on `http://localhost:3002`. When a star rating is then entered into the feedback, this will be sent to the database, or when the game is finished, the finishing time will be sent to the database. To then view the data in the database, we can run `SELECT * from feedback;` to see the star ratings in feedback table or `SELECT * from score` to see all the finishing times. 


