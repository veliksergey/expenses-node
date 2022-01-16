import express from 'express';
import AccountCtrl from '../controllers/account.controller';

const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new AccountCtrl();
  const accounts = await ctrl.getAccounts();
  return res.json(accounts);
})

router.get('/:id', async (req, res) => {
  const ctrl = new AccountCtrl();
  const account = await ctrl.getAccount(req.params.id);
  if (!account) return res.status(404).json({message: 'No account found'});
  return res.json(account);
})

router.post('/', async (req, res) => {
  const ctrl = new AccountCtrl();
  const account = await ctrl.createAccount(req.body);
  return res.json(account);
})

export default router;