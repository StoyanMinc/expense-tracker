import { Router } from 'express';
import { createTransaction, deleteTransaction, getTransactionsByUserasync, getUserSummaryasync } from '../controllers/transactions-controller.js';

const router = Router();

router.get('/:id', getTransactionsByUserasync);

router.post('/', createTransaction);

router.delete('/:id', deleteTransaction);

router.get('/summary/:id', getUserSummaryasync);

export default router;