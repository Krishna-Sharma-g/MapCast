import dotenv from "dotenv"

dotenv.config()

const requiredVars = ["PORT", "MONGO_URI", "JWT_SECRET", "MAPBOX_TOKEN", "OPENWEATHER_KEY", "FRONTEND_URLS"]

const missing = requiredVars.filter((key) => !process.env[key])

if (missing.length && process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.warn(`Warning: Missing required environment variables: ${missing.join(", ")}`)
}

export const env = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/weather_dashboard_dev",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  mapboxToken: process.env.MAPBOX_TOKEN || "",
  openWeatherKey: process.env.OPENWEATHER_KEY || "",
  rapidApiKey: process.env.RAPID_API_KEY || "",
  frontendUrls: (process.env.FRONTEND_URLS || "").split(",").map((url) => url.trim()),
}
