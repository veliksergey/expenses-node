import express from 'express';
import ProjectCtrl from '../controllers/project.controller';

const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new ProjectCtrl();
  const response = await ctrl.getProjects();
  return res.json(response);
});

router.get('/:id', async (req, res) => {
  const ctrl = new ProjectCtrl();
  const response = await ctrl.getProject(req.params.id);
  if (!response) return res.status(404).json({message: 'No project found'});
  return res.json(response);
});

router.post('/', async (req, res) => {
  const ctrl = new ProjectCtrl();
  const response = await ctrl.createProject(req.body);
  return res.json(response);
});

export default router;