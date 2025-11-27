import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import * as apiClients from '../src/utils/apiClients.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());
});

afterEach(async () => {
  jest.restoreAllMocks();
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await disconnectDB();
  await mongo.stop();
});

const registerAndLogin = async () => {
  const userPayload = {
    name: 'Sam Searcher',
    email: 'sam@example.com',
    password: 'secret123',
  };

  await request(app).post('/api/auth/signup').send(userPayload);
  const login = await request(app).post('/api/auth/login').send({
    email: userPayload.email,
    password: userPayload.password,
  });
  return login.body.data.token;
};

describe('Search & Weather routes', () => {
  it('returns debounced search results from Mapbox client', async () => {
    const token = await registerAndLogin();
    const mockedLocations = [
      { id: '1', name: 'London, UK', lat: 51.5, lng: -0.12 },
      { id: '2', name: 'Paris, FR', lat: 48.8, lng: 2.3 },
    ];

    jest
      .spyOn(apiClients, 'geocodeLocations')
      .mockResolvedValue(mockedLocations);

    const res = await request(app)
      .get('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: 'lon' });

    expect(apiClients.geocodeLocations).toHaveBeenCalledWith('lon');
    expect(res.status).toBe(200);
    expect(res.body.data.locations).toHaveLength(2);
  });

  it('returns structured weather data from OpenWeather client', async () => {
    const token = await registerAndLogin();
    const mockedWeather = {
      location: 'Berlin',
      coordinates: { lat: 52.5, lng: 13.4 },
      temperature: 21,
      feelsLike: 20,
      humidity: 55,
      description: 'clear sky',
      icon: '01d',
      windSpeed: 4,
    };

    jest
      .spyOn(apiClients, 'fetchWeatherByCoords')
      .mockResolvedValue(mockedWeather);

    const res = await request(app)
      .get('/api/weather')
      .set('Authorization', `Bearer ${token}`)
      .query({ lat: 52.5, lng: 13.4 });

    expect(apiClients.fetchWeatherByCoords).toHaveBeenCalledWith('52.5', '13.4');
    expect(res.status).toBe(200);
    expect(res.body.data.weather.location).toBe('Berlin');
  });
});
