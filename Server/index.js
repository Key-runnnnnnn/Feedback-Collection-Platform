import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

// Handle multiple client URLs from environment variable and add common development URLs
const clientUrls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
const allowedOrigins = [
  ...clientUrls,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://feedback-collection-platform-delta.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Welcome to the Feedback Collection Platform API");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/form", formRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));