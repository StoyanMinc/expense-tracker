import { Router } from 'express';
import { getCurrency } from '../controllers/currency-controller.js';

const router = Router();

router.get('/', getCurrency);

export default router;