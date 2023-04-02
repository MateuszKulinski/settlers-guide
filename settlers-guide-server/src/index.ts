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
import path from "path";
import multer from "multer";
import { addGuideImage, createImagePath } from "./repo/ImageRepo";
import fs from "fs";

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
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

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

    app.use(express.static("public"));

    app.get(
        `/api/${process.env.API_VERSION}/img/:type/:id`,
        async (req, res) => {
            const { type, id } = req.params;
            const imagePath = await createImagePath(type, id, __dirname);
            try {
                if (!fs.existsSync(imagePath)) {
                    res.sendFile(path.join(__dirname, "/img/no-image.png"));
                } else {
                    res.sendFile(imagePath);
                }
            } catch (err) {
                console.error(err);
                res.status(500).send("Błąd serwera");
            }
        }
    );

    app.post(
        `/api/${process.env.API_VERSION}/upload-file/:type`,
        upload.single("file"),
        async (req, res) => {
            try {
                const data = await addGuideImage(
                    Number(req.params.type),
                    req.file
                );
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader(
                    "Access-Control-Allow-Headers",
                    "Origin, X-Requested-With, Content-Type, Accept"
                );

                res.status(200).json(data);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );

    app.listen({ port: _PORT_ }, () => {
        console.log(
            `Server ready  at http://localhost:${_PORT_}${_SERVER_URL_}`
        );
    });
};

main();
