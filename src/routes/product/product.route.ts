import { Router } from 'express';
import * as control from './product.controller';
import { isAuth, grantAccess } from '../../utilities/authentication';

const router: Router = Router();

router.get('/', isAuth, grantAccess('readAny', 'product'), control.getAllProduct);

router.get('/:id', isAuth, grantAccess('readAny', 'product'), control.getProductById);

router.post('/', isAuth, grantAccess('createAny', 'product'), control.createProduct);

router.put('/:id', isAuth, grantAccess('updateAny', 'product'), control.editProduct);

router.delete('/:id', isAuth, grantAccess('deleteAny', 'product'),  control.removeProduct);

router.post('/:id/reviews', isAuth, grantAccess('readAny', 'review'), control.review);

router.get('/:id/reviews', isAuth, grantAccess('updateOwn', 'product'), control.getAllReview);

export const ProductRoutes: Router = router;
