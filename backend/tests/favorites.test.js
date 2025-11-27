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

const authToken = async () => {
  const user = {
    name: 'Fran Favorite',
    email: `fran+${Date.now()}@example.com`,
    password: 'secret123',
  };

  await request(app).post('/api/auth/signup').send(user);
  const login = await request(app).post('/api/auth/login').send({
    email: user.email,
    password: user.password,
  });
  return login.body.data.token;
};

describe('Favorites routes', () => {
  it('adds a favorite for the authenticated user', async () => {
    const token = await authToken();
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tokyo', lat: 35.6, lng: 139.7 });

    expect(res.status).toBe(201);
    expect(res.body.data.favorite.name).toBe('Tokyo');
  });

  it('returns favorites for the authenticated user', async () => {
    const token = await authToken();
    await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Rome', lat: 41.9, lng: 12.5 });

    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.favorites).toHaveLength(1);
    expect(res.body.data.favorites[0].name).toBe('Rome');
  });

  it('deletes a favorite by id', async () => {
    const token = await authToken();
    const created = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sydney', lat: -33.8, lng: 151.2 });

    const favoriteId = created.body.data.favorite._id;
    const del = await request(app)
      .delete(`/api/favorites/${favoriteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(200);

    const after = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(after.body.data.favorites).toHaveLength(0);
  });
});
