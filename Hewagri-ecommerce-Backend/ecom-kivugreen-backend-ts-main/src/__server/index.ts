import { HttpStatusMessages } from './../__enums/enum.httpsmessage';
import express, { NextFunction, Request, Response, Application } from "express";
import cors from "cors";
import * as dotenv from 'dotenv'
import { HttpStatusCode } from "../__enums/enum.httpsstatuscode";
import { Responder } from "../__helpers/helper.responseserver";
import * as fs from 'fs';
import http from 'http';
import * as path from 'path';
import morgan from 'morgan';
import fileUpload from 'express-fileupload'
import { accessValidator } from "../__middlewares/middleware.accessvalidator";
import { routes } from "../__routes/index";
import { ServiceImage } from '../__services/services.images';
import { log } from 'console';
import { Server, Socket } from 'socket.io';
import { initAssociations } from '../__models/associations';

dotenv.config();

// Initialiser les associations Sequelize une seule fois au démarrage
initAssociations();

const { APP_NAME, APP_PORT, APP_VERSION } = process.env;

const app: Application = express();
const server = http.createServer(app);
const PORT = APP_PORT || 8012;
const ___logAccess = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        // allowedHeaders: ["x-ecommerce-kgreen-api"],
        // credentials: true
    }
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: [
        "http://localhost:3000",    // Frontend Client
        "http://localhost:4003",    // Frontend Admin
        "http://localhost:4005",    // Mobile POS PWA
        "http://localhost:8084",    // Expo Metro Web
        "http://localhost:8088",    // Expo Metro Web (alt port)
        "http://localhost:8089",
        "http://localhost:8092",    // Expo Metro Web
        "http://localhost:8093",    // Mobile POS Web
        "http://localhost:8095",    // Mobile POS Web (alt port)
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4003",
        "http://127.0.0.1:4005",
        "http://127.0.0.1:8084",
        "http://127.0.0.1:8088",
        "http://127.0.0.1:8089",
        "http://127.0.0.1:8092",
        "http://127.0.0.1:8093",    // Mobile POS Web
        "http://127.0.0.1:8095",    // Mobile POS Web (alt port)
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "x-ecommerce-kgreen-api", "x-ecommerce-mobkgreen-api"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    // Ne pas écraser les headers CORS déjà définis par cors()
    // Surtout pour les requêtes OPTIONS (preflight)
    if (req.method !== 'OPTIONS') {
        const { url, method, body, query, params, ip, ips } = req
        log("::: Req ::: ", JSON.stringify({
            url,
            method,
            body,
            query,
            params,
            ip,
            ips
        }))
    }
    next();
});

app.use(morgan("combined", { stream: ___logAccess }));

io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.id);
    io.emit('pairingdone', socket.id);

    socket.on('scanned', (data) => {
        log(data)
    })

    socket.on('message', (msg) => {
        console.log('Received message:', msg);
        socket.send('Message received');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    return Responder(res, HttpStatusCode.Ok, { ...HttpStatusMessages })
});
app.use("/__assets", routes);
app.use("/assets", routes);
app.use("/src", routes);
app.use('/api', accessValidator, routes); //

app.use((req: Request, res: Response, next: NextFunction) => {
    const { url, method, body } = req
    return Responder(res, HttpStatusCode.NotFound, {
        url,
        method,
        body
    })
});

server.listen(PORT, () => {
    console.log(`< ========== > ${APP_NAME} TEST APP ON ${APP_PORT} < ========== >`);
});

