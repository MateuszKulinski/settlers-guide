import { DataSource } from "typeorm";
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PH_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_ACCOUNT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: Boolean(process.env.PG_SYNCHRONIZE === "false" ? false : true),
    logging: Boolean(process.env.PG_LOGGING === "false" ? false : true),
    entities: [String(process.env.PG_ENTITIES)],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized");
    })
    .catch((err) => {
        console.log("Error during App Source initialization", err);
    });

export default AppDataSource;
