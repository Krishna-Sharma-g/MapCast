import { fetchWeatherByCoords } from '../utils/apiClients.js';

export const getWeather = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng are required',
        data: null,
      });
    }

    const weather = await fetchWeatherByCoords(lat, lng);
    return res.json({ success: true, data: { weather } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch weather',
      data: null,
      error: error.message,
    });
  }
};
