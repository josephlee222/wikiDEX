import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { Config } from "./entity/Config"
import * as dotenv from "dotenv"

dotenv.config();

const PORT = process.env.WIKIDEX_PORT || 3000;

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(PORT)

    // check if config entries exist, if not create them
    const configRepository = AppDataSource.getRepository(Config);
    const configKeys = ["WIKIDEX_NAME", "WIKIDEX_VERSION", "WIKIDEX_DESCRIPTION", "WIKIDEX_AUTHOR"];
    for (const key of configKeys) {
        let config = await configRepository.findOneBy({ key });
        if (!config) {
            config = new Config();
            config.key = key;
            config.value = process.env[key] || "";
            await configRepository.save(config);
        }
    }


    console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT}/users to see results`)
}).catch(error => console.log(error))
