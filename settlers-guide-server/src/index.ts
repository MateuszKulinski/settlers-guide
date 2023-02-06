// import connectRedis from "connect-redis";
// import Redis from "ioredis";
import express from "express";
// import session from "express-session";
import { createServer } from "http";
import AppDataSource from "./DataSource";

require("dotenv").config();

const main = async () => {
    const app = express();
    const server = await createServer(app);
    const _PORT_ = process.env.APP_PORT;

    await AppDataSource.initialize();

    server.listen({ port: _PORT_ }, () => {
        console.log("Server working...");
    });
};

main();
