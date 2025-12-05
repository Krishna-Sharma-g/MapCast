import http from "http"
import app from "./app.js"
import { connectDB } from "./config/db.js"

const server = http.createServer(app)

const start = async () => {
  try {
    await connectDB()
    const port = process.env.PORT || 3000
    server.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error("Server failed to start", error)
    process.exit(1)
  }
}

if (process.env.VERCEL_ENV !== "production" && !process.env.VERCEL) {
  start()
}

export default server
