import { Router } from 'express';
import { createTransaction, deleteTransaction, deleteUserTransactions, getTransactionsByUserId, getTransactionsStatistic, getUserSummary } from '../controllers/transactions-controller.js';

const router = Router();
router.get('/:id', getTransactionsByUserId);

router.post('/', createTransaction);

router.delete('/:id', deleteTransaction);

router.get('/summary/:id', getUserSummary);

router.get('/get-stats/:id', getTransactionsStatistic);

router.delete('/delete-user-transactions/:id', deleteUserTransactions)

export default router;