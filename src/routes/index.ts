import { Router } from 'express';
import { UserRoutes } from './user/user.route';
import { ProductRoutes } from './product/product.route';

const router: Router = Router();

router.use('/user', UserRoutes);

router.use('/product', ProductRoutes);

export const MainRouter: Router = router;
