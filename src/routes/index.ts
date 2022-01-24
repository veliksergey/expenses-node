import express from 'express';
import TransRouter from './transaction.router';
import ItemRouter from './item.route';
import DocRouter from './document.route';

// import ProjectRouter from './project.router';
// import VendorRouter from './vendor.route';
// import AccountRouter from './account.router';
// import CatRouter from './category.router';
// import PersonRouter from './person.router';

const router = express.Router();

router.use('/transactions', TransRouter);
router.use('/items', ItemRouter);
router.use('/documents', DocRouter);

// router.use('/projects', ProjectRouter);
// router.use('/vendors', VendorRouter);
// router.use('/accounts', AccountRouter);
// router.use('/categories', CatRouter);
// router.use('/people', PersonRouter);

export default router;