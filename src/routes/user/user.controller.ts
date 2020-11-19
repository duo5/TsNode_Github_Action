import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_SIZE } from '../../utilities/secret';
import IUserModel, { User } from '../../database/models/user.model';
import passport from 'passport';
import * as userService from './user.service';

/**
 * @api {get} /user/:id Request User information
 * @apiPermission Admin
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} email  Email of the User.
 * @apiSuccess {String} image  Image of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "duong",
 *       "email": "duong.hoang@vmodev.com",
 *       "image": ""
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
export function getUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    User.findById(id)
    .then( (data) => {
        return res.json(data.toJSON());
    })
    .catch(next);
}

/**
 * @api {post} /user Request to register new user
 * @apiPermission User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {Object} [user] object user.
 * @apiParam {String} [user[username]] username of user.
 * @apiParam {String} [user[email]] email of user.
 * @apiParam {String} [user[password]] password of user.
 * @apiParam {String} [user[image]] image of user.
 *
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} email  Email of the User.
 * @apiSuccess {String} image  Image of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "duong",
 *       "email": "duong.hoang@vmodev.com",
 *       "image": ""
 *     }
 */
export function register(req: Request, res: Response, next: NextFunction) {
    const user: IUserModel = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);
    user.image = '';
    if (req.body.user.role) {
        user.role = req.body.user.role;
    }
    return user.save()
    .then(()=> {
        return res.json({user: user.toJSON()});
    })
    .catch(next);
}

/**
 * @api {post} /user/login Request to login
 * @apiPermission User
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {Object} [user] object user.
 * @apiParam {String} [user[email]] email of user.
 * @apiParam {String} [user[password]] password of user.
 *
 * @apiSuccess {Object} [user] object user.
 * @apiSuccess {String} [user[msg]] notify success login.
 * @apiSuccess {String} [user[accessToken]] Access Token.
 * @apiSuccess {String} [user[refreshToken]] Refresh Token.
 * @apiSuccess {String} [user[name]] Username.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "msg": "Login success",
 *         "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWMxMzlkZmJlZjAxMWU3NGFmZmU4YiIsInVzZXJuYW1lIjoiaG9hbmdkdW9uZzIiLCJyb2xlIjoidXNlciIsImlhdCI6MTYwNTE0NjU0MiwiZXhwIjoxNjA1MTQ3MTQyfQ.wRAZW1_s5xnrxG-K7hY_ZqwP7d7D2gQXOwTMeVyPA5w",
 *         "refreshToken": "7KQCBdRVRfBsY2yq8M5nu1V2r303K7VZH8hHEOh47hTbmYipP8OlfxBJU8kj1WDVcS9UJHXI7s03RBG0mJhVgDS7eA2mmzOxMkfw",
 *         "name": "hoangduong2"
 *       }
 *     }
 *
 * @apiError Invalid Incorect Email or password.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Invalid
 *     {
 *       "error": "Incorect Email"
 *     }
 */
export function login(req: Request, res: Response, next: NextFunction) {
    if (!req.body.user.email) {
        return res.status(422).json({errors: {email: 'Can\'t be blank'}});
    }

    if (!req.body.user.password) {
        return res.status(422).json({errors: {password: 'Can\'t be blank'}});
    }
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) {
            return next(err);
        }
        if (user) {
            return res.json({user: user.toLoginSuccess()});
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
}

/**
 * @api {post} /user/refesh Request To Get new refresh token
 * @apiPermission User
 * @apiName RefreshToken
 * @apiGroup User
 *
 * @apiHeader {String} x_authorization Old Access Token.
 *
 * @apiParam {String} refreshToken refresh Token.
 *
 * @apiSuccess {Object} [user] object user.
 * @apiSuccess {String} [user[msg]] notify success login.
 * @apiSuccess {String} [user[accessToken]] Access Token.
 * @apiSuccess {String} [user[refreshToken]] Refresh Token.
 * @apiSuccess {String} [user[name]] Username.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWMxMzlkZmJlZjAxMWU3NGFmZmU4YiIsInVzZXJuYW1lIjoiaG9hbmdkdW9uZzIiLCJyb2xlIjoidXNlciIsImlhdCI6MTYwNTE0NjU0MiwiZXhwIjoxNjA1MTQ3MTQyfQ.wRAZW1_s5xnrxG-K7hY_ZqwP7d7D2gQXOwTMeVyPA5w",
 *     }
 *
 * @apiError Invalid Incorect Email or password.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Invalid
 *     {
 *       "error": "Incorect Email"
 *     }
 */
export async function refreshToken(req, res, next) {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
        return res.status(400).send('Can not find access token.');
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return res.status(400).send('Cant not find refresh token.');
    }

    const accessTokenSecret = JWT_SECRET;
    const accessTokenLife = ACCESS_TOKEN_LIFE;

    // Decode access token đó
    const decoded = await userService.decodeToken(
    accessTokenFromHeader,
        // tslint:disable-next-line: indent
		accessTokenSecret,
    );
    if (!decoded) {
        return res.status(400).send('Access token is invalid');
    }
    const username = decoded.username; // Lấy username từ payload
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).send('User is not exist');
        }
        if (refreshTokenFromBody !== user.refreshToken) {
            return res.status(400).send('Refresh token is invalid');
        }
            // Tạo access token mới
        const dataForAccessToken = {
            username,
        };

        const accessToken = user.generateJWT();
        if (!accessToken) {
            return res
                .status(400)
                .send('Can\'t not create accessToken, please try again');
        }
        return res.json({
            accessToken,
        });
    } catch (error) {
        next(error);
    }
}
