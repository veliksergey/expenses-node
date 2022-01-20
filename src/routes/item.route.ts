import express from 'express';
import ItemCtrl from '../controllers/item.controller';

const router = express.Router();

router.get('/:type', async (req, res) => {
  const ctrl = new ItemCtrl();
  const response = await ctrl.getItems(req.params.type);
  return res.json(response);
});

router.get('/:type/:id', async (req, res) => {
  const ctrl = new ItemCtrl();
  const response = await ctrl.getItem(req.params.type, req.params.id);
  return res.json(response);
})

router.post('/:type', async (req, res) => {
  const ctrl = new ItemCtrl();
  const response = await ctrl.createItem(req.params.type, req.body);
  return res.json(response);
});

router.put('/:type/:id', async (req, res) => {
  const ctrl = new ItemCtrl();
  const response = await ctrl.updateItem(req.params.type, req.params.id, req.body);
  return res.json(response);
})

export default router;