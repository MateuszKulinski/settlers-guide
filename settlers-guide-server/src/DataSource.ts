import { DataSource } from "typeorm";
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PH_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_ACCOUNT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: Boolean(process.env.PG_SYNCHRONIZE),
    logging: Boolean(process.env.PG_LOGGING),
    entities: [String(process.env.PG_ENTITIES)],

    // type: "mysql",
    // host: process.env.__MYSQL__HOST__,
    // port: Number(process.env.__MYSQL__PORT__),
    // username: process.env.__MYSQL__USERNAME__,
    // password: process.env.__MYSQL__PASSWORD__,
    // database: process.env.__MYSQL__DATABASE__NAME__,
    // logging: Boolean(process.env.__MYSQL__LOGGING__),
    // entities: [String(process.env.__MYSQL__ENTITIES__)],
    // synchronize: Boolean(process.env.__MYSQL__SYNCHRONIZE__),
    // cli: {
    //     entitiesDir: process.env.__MYSQL__ENTITIES__DIR__,
    // },
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized");
    })
    .catch((err) => {
        console.log("Error during App Source initialization", err);
    });

export default AppDataSource;
