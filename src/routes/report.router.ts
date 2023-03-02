import express from 'express';
import ReportCtrl from '../controllers/report.controller';
const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new ReportCtrl();

  console.log('** req.query:', req.query);

  const projectId: string = (req.query.projectId || 0).toString();
  const categoryId: string = (req.query.categoryId || 0).toString();
  const year: string = (req.query.year || '').toString();
  const groupBy: string = (req.query.groupBy || '').toString();
  // @ts-ignore
  const condition1Id: 'false'|'true'|'all' = (req.query.condition1Id || 'all').toString();
  const excludeLoans: string = (req.query.excludeLoans || 'false').toString();

  const result = await ctrl.getReport(projectId, categoryId, year, groupBy, condition1Id, excludeLoans);
  return res.json(result);
});

export default router;