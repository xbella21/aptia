const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../../server');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropCollection('users').catch(() => {});
  await mongoose.disconnect();
});

describe('Auth API - Integration Tests', () => {

  const user = {
    fullName: 'Isabella Integration', email: `isa_${Date.now()}@test.com`,
    documentId: `DOC${Date.now()}`, password: 'Pass1234!'
  };

  let token;

  it('POST /api/auth/register → 201 y retorna token', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('POST /api/auth/register → 409 si email duplicado', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(409);
  });

  it('POST /api/auth/login → 200 con credenciales válidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: user.email, password: user.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('POST /api/auth/login → 401 con contraseña incorrecta', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: user.email, password: 'Incorrecta!'
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/auth/me → 200 con token válido', async () => {
    const res = await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  it('GET /api/auth/me → 401 sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});