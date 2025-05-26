import { Router } from 'express';
import transactionsRouter from './routers/transactions-router.js';
const router = Router();

router.use('/transactions', transactionsRouter)
export default router;