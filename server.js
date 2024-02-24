import "dotenv/config";

import express from "express";

import cors from "cors";

import { connectToMongoDb } from "./config/dbConfig.js";
import bookRouter from "./routers/bookRouter.js";
import burrowRouter from "./routers/burrowRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express();
const PORT = process.env.PORT || 8000;

//Middlewares
app.use(cors())
app.use(express.json())

//conect to database
connectToMongoDb()

// Routers
app.use("/api/user", userRouter)
app.use("/api/book", bookRouter)
app.use("/api/burrow", burrowRouter)
app.use("/api/review", reviewRouter)
// start our server
app.listen(PORT, (error) => {
  error ? console.log("Error", error) : console.log("Server is running")
})