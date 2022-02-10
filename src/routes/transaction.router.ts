import express from 'express';
import TransCtrl from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', async(req, res) => {
  const ctrl = new TransCtrl();

  const page: string = (req.query.page || 1).toString();
  const rowsPerPage: string = (req.query.rowsPerPage || 10).toString();
  const sortBy: string = (req.query.sortBy || 'date').toString();
  const descending: string = (req.query.descending || 'true').toString();
  const search: string = (req.query.search || '').toString();
  const filters: string = (req.query.filters || '').toString();

  const transactions = await ctrl.getTransactions(page, rowsPerPage, sortBy, descending, search, filters);
  return res.json(transactions);
});

router.get('/duplicates', async (req, res) => {
  const ctrl = new TransCtrl();

  const date = (req.query.date || '').toString();
  const relatedDate = (req.query.relatedDate || '').toString();
  const amount = (req.query.amount || '').toString();
  const relatedAmount = (req.query.relatedAmount || '').toString();
  const id = (req.query.id || '').toString();

  if (!date || !amount) return res.json({errMsg: 'Missing some parameters'});

  const transactions = await ctrl.getPossibleDuplicates(date, relatedDate, amount, relatedAmount, id);
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