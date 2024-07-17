import express from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import novelRoutes from "./routes/novel.js";
import chapterRoutes from "./routes/chapter.js";

configDotenv();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/api/v1/novels", novelRoutes);
app.use("/api/v1/chapters", chapterRoutes);

// Start the server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
