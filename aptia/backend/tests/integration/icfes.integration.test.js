const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../../server');

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const res = await request(app).post('/api/auth/register').send({
    fullName: 'ICFES Tester', email: `icfes_${Date.now()}@test.com`,
    documentId: `ICFES${Date.now()}`, password: 'Pass1234!'
  });
  token = res.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropCollection('icfesscores').catch(() => {});
  await mongoose.connection.db.dropCollection('users').catch(() => {});
  await mongoose.disconnect();
});

describe('ICFES API - Integration Tests', () => {

  const scores = {
    scoreMath: 200, scoreReading: 180, scoreSciences: 190,
    scoreSocial: 170, scoreEnglish: 160, scoreGlobal: 400
  };

  it('POST /api/icfes → 201 guarda puntajes', async () => {
    const res = await request(app).post('/api/icfes')
      .set('Authorization', `Bearer ${token}`).send(scores);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.scoreGlobal).toBe(400);
  });

  it('GET /api/icfes/me → 200 retorna mis puntajes', async () => {
    const res = await request(app).get('/api/icfes/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('POST /api/icfes/confirm → 200 confirma puntajes', async () => {
    const res = await request(app).post('/api/icfes/confirm')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.confirmed).toBe(true);
  });
});