import express from 'express';
import ProjectRouter from './project.router';
import VendorRouter from './vendor.route';
import TransRouter from './transaction.router';

const router = express.Router();

router.use('/projects', ProjectRouter);
router.use('/vendors', VendorRouter);
router.use('/transactions', TransRouter);

export default router;