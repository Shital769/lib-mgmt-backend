import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { ERROR } from "./src/constant.js";

const app = express();
const PORT = process.env.NODE_ENV || 8000;

//connect to database
import { connectDB } from "./src/config/dbConfig.js";
connectDB();

//middlewares
app.use(express.json);
app.use(cors());

//api routers
import userRouter from "./src/routers/userRouter.js";
app.use("/api/v1/user", userRouter);

//all uncaught request
app.use("*", (req, res) => {
  res.json({
    message: "System status is alright!",
  });
});

//global error handler
app.use((error, req, res, next) => {
  console.log(error.message);

  const errorCode = error.errorCode || 500;
  res.status(errorCode).json({
    status: ERROR,
    message: error.message,
  });
});

//run the server
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${PORT}`);
});
