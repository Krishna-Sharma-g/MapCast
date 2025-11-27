import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await disconnectDB();
  await mongo.stop();
});

describe('Auth routes', () => {
  const userPayload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret123',
  };

  it('allows a user to signup and returns a token', async () => {
    const res = await request(app).post('/api/auth/signup').send(userPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(userPayload.email);
    expect(res.body.data.token).toBeTruthy();
  });

  it('allows a user to login with valid credentials', async () => {
    await request(app).post('/api/auth/signup').send(userPayload);

    const res = await request(app).post('/api/auth/login').send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
  });

  it('blocks access to protected route without JWT and succeeds with JWT', async () => {
    await request(app).post('/api/auth/signup').send(userPayload);
    const login = await request(app).post('/api/auth/login').send({
      email: userPayload.email,
      password: userPayload.password,
    });

    const noTokenRes = await request(app).get('/api/auth/profile');
    expect(noTokenRes.status).toBe(401);

    const token = login.body.data.token;
    const withToken = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(withToken.status).toBe(200);
    expect(withToken.body.data.user.email).toBe(userPayload.email);
  });
});
