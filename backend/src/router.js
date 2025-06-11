import { Router } from 'express';
import transactionsRouter from './routers/transactions-router.js';
import currencyRouter from './routers/currency-router.js';

const router = Router();

router.use('/transactions', transactionsRouter);
router.use('/currencies', currencyRouter)
export default router;