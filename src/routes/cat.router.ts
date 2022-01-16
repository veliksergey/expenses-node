import express from 'express';
import CatCtrl from '../controllers/cat.controller';

const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new CatCtrl();
  const response = await ctrl.getCats();
  return res.json(response);
});

router.get('/:id', async (req, res) => {
  const ctrl = new CatCtrl();
  const response = await ctrl.getCat(req.params.id);
  if (!response) return res.status(404).json({message: 'No category found'});
  return res.json(response);
});

router.post('/', async (req, res) => {
  const ctrl = new CatCtrl();
  const response = await ctrl.createCat(req.body);
  return res.json(response);
});

export default router;