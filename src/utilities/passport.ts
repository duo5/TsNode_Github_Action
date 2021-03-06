import passport from 'passport';
import { User } from '../database/models/user.model';
import  passportLocal from 'passport-local';


const LocalStrategy = passportLocal.Strategy;


passport.use(new LocalStrategy({
    // Strategy is based on username & password.  Substitute email for username.
    usernameField: 'user[email]',
    passwordField: 'user[password]'
  },

  (email, password, done) => {

    User
      .findOne({email})
      .then(user => {
        if (!user) {
          // tslint:disable-next-line: no-null-keyword
          return done(null, false, {message: 'Incorrect email.'});
        }
        if (!user.validPassword(password)) {
          // tslint:disable-next-line: no-null-keyword
          return done(null, false, {message: 'Incorrect password.'});
        }
        // tslint:disable-next-line: no-null-keyword
        return done(null, user);
      })
      .catch(done);
  }));