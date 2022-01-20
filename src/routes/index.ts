import express from 'express';
import ProjectRouter from './project.router';
import VendorRouter from './vendor.route';
import TransRouter from './transaction.router';
import AccountRouter from './account.router';
import CatRouter from './category.router';
import PersonRouter from './person.router';
import ItemRouter from './item.route';

const router = express.Router();

router.use('/projects', ProjectRouter);
router.use('/vendors', VendorRouter);
router.use('/transactions', TransRouter);
router.use('/accounts', AccountRouter);
router.use('/categories', CatRouter);
router.use('/people', PersonRouter);
router.use('/items', ItemRouter);

export default router;