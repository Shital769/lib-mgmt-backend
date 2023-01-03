import express from "express";
import { ERROR, SUCCESS } from "../constant";
import { createUser } from "../models/userModel/userModel";
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.json({
      status: SUCCESS,
      message: "todo get user",
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const result = await createUser(req.body);
    console.log(result);
    user?._id
      ? res.json({
          status: SUCCESS,
          message: "User has been created successfully, You may login now ",
        })
      : res.json({
          status: ERROR,
          message: "Invalid login!",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message = "The user with given email id is already exists";
      error.errorCode = 200;
    }

    next(error);
  }
});

export default router;
