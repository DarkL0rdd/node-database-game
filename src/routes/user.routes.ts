import router, { Application } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUsers,
  newTokens,
} from "../controllers/user.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";

export const userRouter: Application = router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.all("/refresh", newTokens); //? куди далі перейти

userRouter.post("/logout", logoutUser);

userRouter.post("/forgot-password", forgotPassword);

//userRouter.get("/reset-password/:link", resetPassword);
userRouter.post("/reset-password/:link", resetPassword);

userRouter.get("/users", authenticateAccessToken, getUsers);
