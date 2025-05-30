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
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}...`); });
})