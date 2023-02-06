require("dotenv").config();

module.exports = [
    {
        type: "mysql",
        host: process.env.__MYSQL__HOST__,
        port: Number(process.env.__MYSQL__PORT__),
        username: process.env.__MYSQL__USERNAME__,
        password: process.env.__MYSQL__PASSWORD__,
        database: process.env.__MYSQL__DATABASE__NAME__,
        synchronize: Boolean(process.env.__MYSQL__SYNCHRONIZE__),
        logging: Boolean(process.env.__MYSQL__LOGGING__),
        entities: [String(process.env.__MYSQL__ENTITIES__)],
        cli: {
            entitiesDir: process.env.__MYSQL__ENTITIES__DIR__,
        },
    },
];
