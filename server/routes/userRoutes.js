import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getFavorites,
  getUserBookings,
  updateFavorite,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/favorites", requireAuth(), getFavorites);
userRouter.post("/update-favorite", requireAuth(), updateFavorite);
userRouter.get("/bookings", requireAuth(), getUserBookings);



export default userRouter