import express from 'express';
import VendorCtrl from '../controllers/vendor.controller';

const router = express.Router();

router.get('/', async(req, res) => {
  const ctrl = new VendorCtrl();
  const response = await ctrl.getVendors();
  return res.json(response);
});

router.get('/:id', async(req, res) => {
  const ctrl = new VendorCtrl();
  const response = await ctrl.getVendor(req.params.id);
  if (!response) return res.status(404).json({message: 'No vendor found'});
  return res.json(response);
});

router.post('/', async(req, res) => {
  const ctrl = new VendorCtrl();
  const response = await ctrl.createVendor(req.body);
  return res.json(response);
})

export default router;