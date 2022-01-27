import express from 'express';
import TransCtrl from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', async(req, res) => {
  const ctrl = new TransCtrl();
  const transactions = await ctrl.getTransactions();
  return res.json(transactions);
});

router.get('/:id', async (req, res) => {
  const ctrl = new TransCtrl();
  const response = await ctrl.getTransaction(req.params.id);
  if (!response) return res.status(404).json({message: 'No transaction found'});
  return res.json(response);
});

router.post('/', async(req, res) => {
  const ctrl = new TransCtrl();
  const response = await ctrl.createTransaction(req.body);
  return res.json(response);
})

router.put('/:id', async (req, res) => {
  const ctrl = new TransCtrl();
  const response = await ctrl.updateTransaction(req.params.id, req.body);
  return res.json(response);
})

export default router;