import axios from 'axios';
import { env } from '../config/env.js';

export const getNearbyNews = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng are required',
        data: null,
      });
    }

    const options = {
      method: 'POST',
      url: 'https://specrom-news-api.p.rapidapi.com/',
      headers: {
        'x-rapidapi-key': env.rapidApiKey,
        'x-rapidapi-host': 'specrom-news-api.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      data: {
        api_type: 'news_by_latitude_longitude',
        lat: String(lat),
        longitude: String(lng),
      },
    };

    const response = await axios.request(options);
    const articles = response.data.article_list?.slice(0, 5) || [];

    return res.json({
      success: true,
      data: {
        news: articles.map((article) => ({
          id: article.url_id,
          title: article.title,
          source: article.source_name,
          publishedDate: article.published_date,
          urlId: article.url_id,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      data: null,
      error: error.message,
    });
  }
};