import express from 'express';
import TransCtrl from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', async(req, res) => {
  const ctrl = new TransCtrl();

  const page: string = (req.query.page || 1).toString();
  const rowsPerPage = (req.query.rowsPerPage || 10).toString();
  const orderBy = (req.query.orderBy || 'date').toString();
  const descending = (req.query.descending || 'true').toString();
  const filter = (req.query.filter || '').toString();

  const transactions = await ctrl.getTransactions(page, rowsPerPage, orderBy, descending, filter);
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