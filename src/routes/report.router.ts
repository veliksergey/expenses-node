import express from 'express';
import ReportCtrl from '../controllers/report.controller';
const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new ReportCtrl();
  
  const accountId: string = (req.query.accountId || 0).toString();
  const categoryId: string = (req.query.categoryId || 0).toString();
  const personId: string = (req.query.personId || 0).toString();
  const projectId: string = (req.query.projectId || 0).toString();
  const vendorId: string = (req.query.vendorId || 0).toString();
  const groupBy: string = (req.query.groupBy || '').toString();

  const result = await ctrl.getReport(accountId, categoryId, personId, projectId, vendorId, groupBy);
  return res.json(result);
});

export default router;