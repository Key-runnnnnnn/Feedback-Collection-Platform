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


app.use(cors());


app.use(bodyParser.json());
app.use(cookieParser());    
app.get("/", (req, res) => {
  res.send("Welcome to the Feedback Collection Platform API");
});
app.use("/api/v1/auth",authRoutes); 
app.use("/api/v1/form",formRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));