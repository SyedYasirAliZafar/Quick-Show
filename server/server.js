import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/connectDB.js'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js'

dotenv.config()

const app = express()

// MongoDB Connected
await connectDB()

// Allowed Frontend Origins
const allowedOrigins = ["http://localhost:5173"]

// Middlewares
app.use(express.json())
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(clerkMiddleware())

// PORT
const PORT = process.env.PORT || 5000

// Server Route for checking
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Inngest Route for User Creation, Deletion and Updation
app.use("/api/inngest", serve({ client: inngest, functions }));

// Show Movie Route from TMDB (Now-Playing)

app.use("/api/show", showRouter)



// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})