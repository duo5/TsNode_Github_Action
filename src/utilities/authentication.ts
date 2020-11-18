import { JWT_SECRET, ACCESS_TOKEN_LIFE } from './secret';
import { User } from '../database/models/user.model';
import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import { roles } from './roles';

const promisify = util.promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);


export async function isAuth(req, res, next) {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
        return res.status(401).send('Can not find access token!');
    }

    const accessTokenSecret = JWT_SECRET;

    const verified = await verifyToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );
    if (!verified) {
        return res
            .status(401)
            .send('Permision denied!');
    }
    const role = verified.role;
    const name = verified.username;
    const user = await User.findOne({username: name});
    req.user = user;

    return next();
}

export const grantAccess = (action, resource) => {
    return async (req, res, next) => {
     try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: 'You don\'t have enough permission to perform this action'
       });
      }
      next();
     } catch (error) {
      next(error);
     }
    };
};

const verifyToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		// tslint:disable-next-line: no-null-keyword
		return null;
	}
};
