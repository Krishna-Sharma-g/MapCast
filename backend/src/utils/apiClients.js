import axios from 'axios';
import { env } from '../config/env.js';

const mapboxClient = axios.create({
  baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
});

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

export const geocodeLocations = async (query) => {
  const { data } = await mapboxClient.get(`/${encodeURIComponent(query)}.json`, {
    params: {
      access_token: env.mapboxToken,
      autocomplete: true,
      limit: 5,
    },
  });

  return data.features.map((feature) => ({
    id: feature.id,
    name: feature.place_name,
    lat: feature.center[1],
    lng: feature.center[0],
  }));
};

export const reverseGeocode = async (lng, lat) => {
  const { data } = await mapboxClient.get(`/${lng},${lat}.json`, {
    params: {
      access_token: env.mapboxToken,
      limit: 1,
    },
  });

  if (!data.features?.length) {
    return null;
  }

  const [feature] = data.features;
  return {
    id: feature.id,
    name: feature.place_name,
    lat,
    lng,
  };
};

export const fetchWeatherByCoords = async (lat, lng) => {
  const { data } = await weatherClient.get('/weather', {
    params: {
      lat,
      lon: lng,
      appid: env.openWeatherKey,
      units: 'metric',
    },
  });

  return {
    location: data.name,
    coordinates: { lat: data.coord.lat, lng: data.coord.lon },
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    description: data.weather[0]?.description,
    icon: data.weather[0]?.icon,
    windSpeed: data.wind.speed,
  };
};
