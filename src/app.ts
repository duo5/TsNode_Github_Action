import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { Application } from 'express';
import { MainRouter } from './routes';
import { loadErrorHandlers } from './utilities/error-handling';
import passport from 'passport';
import session from 'express-session';
import { SESSION_SECRET } from './utilities/secret';
import './database';
import './utilities/passport';

const app: Application = express();

app.use(helmet());  // protected http header
app.use(cors()); // control cross resources
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 60000
    },
    resave           : false,
    saveUninitialized: false
  }
));
app.use('/api/v1', MainRouter);
app.use('/apidoc', express.static('public'));

loadErrorHandlers(app);

export default app;
