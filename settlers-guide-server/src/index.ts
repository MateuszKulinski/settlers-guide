import express, { json } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import AppDataSource from "./DataSource";
require("dotenv").config();

declare global {
    namespace Express {
        interface SessionData {
            cookie: any;
        }
    }
}

declare module "express-session" {
    interface Session {
        loadedCount: Number;
        test: any;
        userId: any;
    }
}

const main = async () => {
    const app = express();
    const _PORT_ = process.env.APP_PORT;
    const _SERVER_URL_ = String(process.env.SERVER_URL);
    const router = express.Router();

    const redis = new Redis({
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
    });
    const RedisStore = connectRedis(session);
    const redisStore = new RedisStore({
        client: redis,
    });

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await AppDataSource.initialize();
    await apolloServer.start();

    app.use(bodyParser.json());
    app.use(
        session({
            store: redisStore,
            name: process.env.COOKIE_NAME,
            sameSite: "Strict",
            secret: String(process.env.SESSION_SECRET),
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24,
            },
        } as any)
    );
    app.use(router);
    app.use(
        _SERVER_URL_,
        cors<cors.CorsRequest>({
            credentials: true,
            origin: process.env.CLIENT_URL,
        }),
        json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }: any) => ({ req, res }),
        })
    );

    app.listen({ port: _PORT_ }, () => {
        console.log(
            `Server ready  at http://localhost:${_PORT_}${_SERVER_URL_}`
        );
    });
};

main();
