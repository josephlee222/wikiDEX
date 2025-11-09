import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Config } from "./entity/Config"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [
        User,
        Config
    ],
    migrations: [],
    subscribers: [],
})
