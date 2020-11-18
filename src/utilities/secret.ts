import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import * as path from 'path';

dotenv.config({path: `./config/.env.${process.env.NODE_ENV || 'local'}`});

export const ENVIRONMENT    = _.defaultTo(process.env.APP_ENV, 'dev');
export const IS_PRODUCTION  = ENVIRONMENT === 'production';
export const APP_PORT       = _.defaultTo(parseInt(process.env.APP_PORT, 10), 3000);
export const LOG_DIRECTORY  = _.defaultTo(process.env.LOG_DIRECTORY, path.resolve('logs'));
export const JWT_SECRET     = _.defaultTo(process.env.ACCESS_TOKEN_SECRET, 'secret');
export const ACCESS_TOKEN_LIFE     = _.defaultTo(process.env.ACCESS_TOKEN_LIFE, '5m');
export const REFRESH_TOKEN_SIZE = _.defaultTo(parseInt(process.env.REFRESH_TOKEN_SIZE, 10), 100);
export const SESSION_SECRET = _.defaultTo(process.env.SESSION_SECRET, 'secret');
export const DB             = {
    USER    : _.defaultTo(process.env.DB_USER, 'root'),
    PASSWORD: _.defaultTo(process.env.DB_USER_PWD, 'secret'),
    HOST    : _.defaultTo(process.env.DB_HOST, 'localhost'),
    NAME    : _.defaultTo(process.env.DB_NAME, 'conduit'),
    PORT    : _.defaultTo(parseInt(process.env.DB_PORT, 10), 27017),
  };
