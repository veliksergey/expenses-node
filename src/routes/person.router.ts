import express from 'express';
import PersonCtrl from '../controllers/person.controller';

const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new PersonCtrl();
  const response = await ctrl.getPersons();
  return res.json(response);
});

router.get('/:id', async (req, res) => {
  const ctrl = new PersonCtrl();
  const response = await ctrl.getPerson(req.params.id);
  if (!response) return res.status(404).json({message: 'No person found'});
  return res.json(response);
});

router.post('/', async (req, res) => {
  const ctrl = new PersonCtrl();
  const response = await ctrl.createPerson(req.body);
  return res.json(response);
});

export default router;