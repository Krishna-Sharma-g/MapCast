import { geocodeLocations, reverseGeocode } from '../utils/apiClients.js';

export const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
        data: null,
      });
    }

    const locations = await geocodeLocations(query);
    return res.json({ success: true, data: { locations } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to search locations',
      data: null,
      error: error.message,
    });
  }
};

export const reverseLookup = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng are required',
        data: null,
      });
    }

    const location = await reverseGeocode(lng, lat);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
        data: null,
      });
    }

    return res.json({ success: true, data: { location } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reverse geocode location',
      data: null,
      error: error.message,
    });
  }
};
