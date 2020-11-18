import faker from 'faker';
import mongoose from 'mongoose';
import app from '../../../app';
import supertest from 'supertest';
import {Express} from 'express-serve-static-core';
const request = supertest(app);
// import '../../../database';
import { createDummy, createDummyAndAuthorize } from '../../../tests/user';
import * as control from '../user.controller';
import { DB } from '../../../utilities/secret';

let connection: any;
const dbURI = `mongodb+srv://${DB.USER}:${encodeURIComponent(DB.PASSWORD)}@${DB.HOST}/${
  DB.NAME
}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser   : true,
  useCreateIndex    : true,
  useUnifiedTopology: true,
  useFindAndModify  : false,
  autoIndex         : true,
  poolSize          : 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries  : 0,
  connectTimeoutMS  : 30000, // Give up initial connection after 10 seconds
  socketTimeoutMS   : 45000, // Close sockets after 45 seconds of inactivity
};

    beforeAll(async () => {
    connection = await mongoose
    .connect(dbURI, options);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe('POST /api/v1/user/login', () => {
  it('Gets the test endpoint', async done => {
    // Sends GET Request to /test endpoint
    // const dummy = await createDummy();
    const res = (await request.post('/api/v1/user/login')
    .send({
      'user': {
        'email': 'duong23@gmail.com',
        'password': 'duong123321'
      }
    }));
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({
      'msg': expect.stringMatching('Login success'),
      'accessToken': expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
      'refreshToken': expect.stringMatching(/^[A-Za-z0-9]*$/),
      'name': expect.stringMatching(/^[A-Za-z0-9]*$/)
    });
    done();
  });
});
