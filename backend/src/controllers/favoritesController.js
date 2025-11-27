import { Favorite } from '../models/Favorite.js';

export const listFavorites = async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  return res.json({ success: true, data: { favorites } });
};

export const addFavorite = async (req, res) => {
  try {
    const { name, lat, lng } = req.body;
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (!name || Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      return res.status(400).json({
        success: false,
        message: 'name, lat, and lng are required',
        data: null,
      });
    }

    const favorite = await Favorite.create({
      userId: req.user.id,
      name,
      lat: parsedLat,
      lng: parsedLng,
    });

    return res.status(201).json({ success: true, data: { favorite } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      data: null,
      error: error.message,
    });
  }
};

export const deleteFavorite = async (req, res) => {
  const { id } = req.params;
  await Favorite.deleteOne({ _id: id, userId: req.user.id });
  return res.json({
    success: true,
    data: { removedId: id, message: 'Favorite removed' },
  });
};
