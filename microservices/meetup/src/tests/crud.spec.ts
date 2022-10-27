import supertest from 'supertest';
import { app } from '../app';
import { addMeetup, putMeetup, token } from './__mock__/data';
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import { meetup } from '../model/db/meetup';
import chaiExclude from 'chai-exclude';

chai.use(chaiHttp);
chai.use(chaiExclude);


describe('CRUD operations', () => {

  beforeEach(async () => {
    await mongoose.connection.collections.meetups.drop();
    await meetup.create(addMeetup);
  });

  it('read all meetups', async () => {
    const response = await chai.request(app.app).get('/meetups').set('Authorization', token);
    assert.equal(response.status, 200);
    expect(response.body[0]).to.haveOwnProperty('_id');
    expect(response.body[0]).to.haveOwnProperty('createdAt');
    expect(response.body[0]).to.haveOwnProperty('updatedAt');
    expect(response.body[0]).excludingEvery(['_id', 'createdAt', 'updatedAt']).to.deep.equal(addMeetup);
  });

  it('create meetup', async () => {
    const response = await chai.request(app.app).post('/meetups').send(addMeetup).set('Authorization', token);
    assert.equal(response.status, 201);
    expect(response.body).to.haveOwnProperty('_id');
    expect(response.body).to.haveOwnProperty('createdAt');
    expect(response.body).to.haveOwnProperty('updatedAt');
    expect(response.body).to.haveOwnProperty('userId');
    expect(response.body).excludingEvery(['_id', 'createdAt', 'updatedAt', 'userId']).to.deep.equal(addMeetup);
  });

  it('delete meetup', async () => {
    const createdMeetup = await meetup.create(addMeetup);
    const id = createdMeetup._id;
    const deletedResponse = await chai.request(app.app).delete(`/meetups/${id}`).set('Authorization', token);
    assert.equal(deletedResponse.status, 204);
  });

  it('put meetup', async () => {
    const createdMeetup = await meetup.create(addMeetup);
    const id = createdMeetup._id;
    const updatedMeetup = await chai.request(app.app).put(`/meetups/${id}`).send(putMeetup).set('Authorization', token);
    expect(updatedMeetup.body).to.haveOwnProperty('_id');
    expect(updatedMeetup.body).to.haveOwnProperty('createdAt');
    expect(updatedMeetup.body).to.haveOwnProperty('updatedAt');
    expect(updatedMeetup.body).to.haveOwnProperty('userId');
    expect(updatedMeetup.body).excludingEvery(['_id', 'createdAt', 'updatedAt', 'userId']).to.deep.equal(putMeetup);
  });
});
