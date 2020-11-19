import { Router } from 'express';
import { register, login, refreshToken, getUser } from './user.controller';
import { isAuth, grantAccess } from '../../utilities/authentication';

const router: Router = Router();

router.post('/', register);

router.post('/login', login);

router.post('/refresh', refreshToken);

router.get('/:id', isAuth, grantAccess('readAny', 'profile'), getUser);

export const UserRoutes: Router = router;
