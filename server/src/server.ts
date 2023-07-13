import dotenv from 'dotenv';
import path from "path"
import rawBodyBuffer from 'raw-body';

if(process.env.NODE_ENV === "production") {
    console.log("start production mode")
    dotenv.config({ path: path.resolve(__dirname, '../.env.development')});
} else {
    console.log("start development mode")
    dotenv.config({ path: path.resolve(__dirname, '../.env.development')});
}

import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app: Application = express()

const specificDomain: string[] = [
    "45.76.148.155",
    "45.77.174.118",
    "45.76.185.1",
    "45.77.248.182",
    "45.76.179.104",
    "45.76.179.39",
    "45.76.160.35",
    "52.74.15.8",
    "139.180.209.126",
    "https://backoffice.honorlink.org"];
const customContentTypes: string[] = ['bet', 'win', 'cancel', 'charge', 'adjust', 'promo_win', 'exceed_credit'];

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin: string | undefined = req.header('Origin');
    const contentType: string | undefined = req.headers['content-type'];

    console.log(typeof req.body, req.body); // 추가. 요청 본문의 타입과 내용 출력

    if (origin && contentType && specificDomain.includes(origin) && customContentTypes.includes(contentType)) {
        bodyParser.text()(req, res, (err) => {
            if (err) {
                return next(err);
            }

            // console.log(req.body);
            console.log(11)
            next();
        });
    } else {
        bodyParser.json()(req, res, next);
    }
});

app.use(cookieParser());

const allowedOriginsWithCredentials: string[] = [
    "http://localhost:10010", 
    "https://demo.goodfriendsgaming.com"];

const allowedOriginsWithoutCredentials: string[] = [
    "45.76.148.155",
    "45.77.174.118",
    "45.76.185.1",
    "45.77.248.182",
    "45.76.179.104",
    "45.76.179.39",
    "45.76.160.35",
    "52.74.15.8",
    "139.180.209.126",
    "https://backoffice.honorlink.org"];

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin: string | undefined = req.header('Origin');
    let corsOptions: CorsOptions;

    if (origin) {
        if (allowedOriginsWithCredentials.includes(origin)) {
            corsOptions = { origin: allowedOriginsWithCredentials, credentials: true };
        } else {
            corsOptions = { origin: allowedOriginsWithoutCredentials, credentials: false };
        }
    } else {
        corsOptions = { origin: false, credentials: false };
    }

    cors(corsOptions)(req, res, next);
});

import * as middlewares from './middlewares/validation.middlewares';
app.use("/api/*", middlewares.checkHeaders);

// account
import accountRouter from "./routes/account.routes";
app.use("/api/account", accountRouter);

// casino
import casinoRouter from "./routes/casino.routes"
app.use("/api/casino", casinoRouter)

// callback url
import callbackRouter from "./routes/callback.routes"
app.use("/callback", callbackRouter)

const port:number = 9001
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});