import express from 'express';
import ProjectRouter from './project.router';
import VendorRouter from './vendor.route';
import TransRouter from './transaction.router';
import AccountRouter from './account.router';
import CatRouter from './category.router';
import PersonRouter from './person.router';

const router = express.Router();

router.use('/projects', ProjectRouter);
router.use('/vendors', VendorRouter);
router.use('/transactions', TransRouter);
router.use('/accounts', AccountRouter);
router.use('/categories', CatRouter);
router.use('/persons', PersonRouter);

export default router;