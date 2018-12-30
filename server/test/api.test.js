const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏' 
      }, done);
  });
});

describe('POST /api/v1/messages', () => {
  it('inserts a new message', (done) => {
    const requestRes = {
      name: 'Zehan',
      message: 'Hello Everyone!!!',
      latitude: 90,
      longitude: 180,
    };
    const responseRes = {
      ...requestRes,
      _id: '5b57d127923211248855977c',
      date: '2018-07-25T01:23:51.029Z',
    };
    request(app)
      .post('/api/v1/messages')
      .send(requestRes)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id = '5b57d127923211248855977c';
        res.body.date = '2018-07-25T01:23:51.029Z';
      })
      .expect(200, responseRes, done);
  });
  it('sign up with an Diacritics name', (done) => {
    const requestRes = {
      name: 'André',
      message: 'Hello Everyone!!!',
      latitude: 90,
      longitude: 180,
    };
    const responseRes = {
      ...requestRes,
      _id: '5b57d127923211248855977c',
      date: '2018-07-25T01:23:51.029Z',
    };
    request(app)
      .post('/api/v1/messages')
      .send(requestRes)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id = '5b57d127923211248855977c';
        res.body.date = '2018-07-25T01:23:51.029Z';
      })
      .expect(200, responseRes, done);
  });
});
