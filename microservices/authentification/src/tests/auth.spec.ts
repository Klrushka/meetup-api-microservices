import mongoose from 'mongoose';
import {app} from '../app';
import { mockUser } from './__mock__/data';
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';


chai.use(chaiHttp);

describe('authentification test', () => {

  beforeEach(async () => {
    await mongoose.connection.collections.users.drop();
  });


  it('registration', async () => {
    const response = await chai.request(app.app).post('/auth/registration').send(mockUser);
    assert.equal(response.status, 200);
    expect(response.body).to.deep.equal({ message: 'check your email and verify it' });
  });


  it('login', async () => {
    const response = await chai.request(app.app).post('/auth/registration').send(mockUser);
    assert.equal(response.status, 200);
    expect(response.body).to.deep.equal({ message: 'check your email and verify it' });
  });
});