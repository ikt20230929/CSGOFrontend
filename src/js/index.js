import { existsSync } from 'fs'
import dotenv from 'dotenv'
if(process.env.NODE_ENV === "production") {
    if(!existsSync(".env-production")) {
        throw new Error("Application is running in production mode, but no .env-production file is present!");
    }
    dotenv.config({ path: ".env-production" })
}else{
    dotenv.config({ path: ".env-development" })
}

import "./App"
