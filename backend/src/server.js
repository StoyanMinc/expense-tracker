import https from 'https';
import fs from 'fs';
import express from 'express';
import { config } from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middlewares/rateLimiter.js';
import router from './router.js';
import cors from 'cors'
config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(rateLimiter)
app.use('/api', router)

initDB().then(() => {

    https
    .createServer({
        cert: fs.readFileSync("/etc/letsencrypt/live/expensetrackersm.online/cert.pem"),
        key: fs.readFileSync("/etc/letsencrypt/live/expensetrackersm.online/privkey.pem")
    },
        app
    )
    .listen(PORT, () => { console.log(`Server is running on port ${PORT}...`); });
    // app.listen(PORT, () => { console.log(`Server is running on port ${PORT}...`); });
})