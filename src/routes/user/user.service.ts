import * as jwt from 'jsonwebtoken';
import * as util from 'util';

const promisify = util.promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

export async function verifyToken(token, secretKey) {
	try {
		return await verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		// tslint:disable-next-line: no-null-keyword
		return null;
	}
}

export async function decodeToken(token, secretKey) {
	try {
		return await verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		// tslint:disable-next-line: no-null-keyword
		return null;
	}
}
