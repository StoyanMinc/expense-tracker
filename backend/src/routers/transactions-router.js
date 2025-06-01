import { Router } from 'express';
import { createTransaction, deleteTransaction, getTransactionsByUserasync, getTransactionsStatistic, getUserSummaryasync } from '../controllers/transactions-controller.js';

const router = Router();

router.get('/:id', getTransactionsByUserasync);

router.post('/', createTransaction);

router.delete('/:id', deleteTransaction);

router.get('/summary/:id', getUserSummaryasync);

router.get('/get-stats/:id', getTransactionsStatistic)

export default router;