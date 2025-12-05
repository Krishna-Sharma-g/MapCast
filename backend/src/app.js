import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { env } from "./config/env.js"
import authRoutes from "./routes/authRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import weatherRoutes from "./routes/weatherRoutes.js"
import favoritesRoutes from "./routes/favoritesRoutes.js"
import newsRoutes from "./routes/newsRoutes.js"

const app = express()

const allowedOrigins = env.frontendUrls.filter(Boolean)
const vercelUrls = ["https://*.vercel.app", "http://localhost:3000", "http://localhost:3001"]

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelUrls.some((url) => {
        if (url.includes("*")) {
          return new RegExp(url.replace("*", ".*")).test(origin)
        }
        return url === origin
      })
    ) {
      return callback(null, true)
    }
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan("dev"))

app.get("/health", (req, res) => res.json({ success: true, data: { service: "weather-dashboard", status: "ok" } }))

app.use("/api/auth", authRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/favorites", favoritesRoutes)
app.use("/api/news", newsRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  return res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    data: null,
  })
})

export default app
