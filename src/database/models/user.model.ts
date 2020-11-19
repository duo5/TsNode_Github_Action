import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../../interfaces/user.interface';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as randToken from 'rand-token';
import { JWT_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_SIZE } from '../../utilities/secret';
import mongooseUniqueValidator = require('mongoose-unique-validator');

export default interface IUserModel extends IUser, Document {
    acessToken?: string;
    refreshToken?: string;
    generateJWT(): string;
    toJSON(): any;
    setPassword(password: string): void;
    validPassword(password: string): boolean;
    toLoginSuccess(): any;
}

const UserSchema = new Schema({
  username: {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    required : [true, 'can\'t be blank'],
    match    : [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index    : true
  },
  email: {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    required : [true, 'can\'t be blank'],
    match    : [/\S+@\S+\.\S+/, 'is invalid'],
    index    : true
  },
  image: {
    type: Schema.Types.String
  },
  hash: {
    type: Schema.Types.String
  },
  salt: {
    type: Schema.Types.String
  },
  refreshToken:  {
    type: Schema.Types.String
  },
  role: {
    type: Schema.Types.String,
    default: 'user',
    enum: ['user', 'admin']
  }
}, {timestamps: true});

UserSchema.plugin(mongooseUniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function (password: string): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function (): string {
  const today = new Date();
  const exp   = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id      : this._id,
    username: this.username,
    role: this.role
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    expiresIn: ACCESS_TOKEN_LIFE,
  });
};

UserSchema.methods.updateRefreshToken = function (token): any {
  const user = this;
  user.refreshToken = token;
  return user.refreshToken;
};

UserSchema.methods.toJSON = function (): any {
  return {
    username: this.username,
    email   : this.email,
    image   : this.image
  };
};

UserSchema.methods.toLoginSuccess = function (): any {
  const user = this;
  const accessToken = this.generateJWT();
  let refreshToken = randToken.generate(REFRESH_TOKEN_SIZE); // tao refresh token ngau nhien
  if (!user.refreshToken) {
    user.refreshToken = refreshToken;
    user.save();
  } else {
    refreshToken = user.refreshToken;
  }
  return {
    msg: 'Login success',
    accessToken,
    refreshToken,
    name: user.username
  };
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
