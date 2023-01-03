import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ERROR } from "./src/constant.js";
const app = express();
const PORT = process.env.NODE_ENV || 8000;

//connect to database


//all uncaught request
app.use("*", (req, res) => {
  res.json({
    message: "Request resources not found",
  });
});

//global error handler
app.use((error, req, res, next) => {
  console.log(error);

  const errorCode = errorCode || 500;
  res.status(errorCode).json({
    status: ERROR,
    message: error.message,
  });
});

//run the server
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${port}`);
});
