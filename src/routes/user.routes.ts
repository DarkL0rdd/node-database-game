import router, { Application, Request, Response, Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/user.controllers";

export const userRouter: Application = router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

userRouter.get("/refresh", refreshToken);

userRouter.post("/forgot-pass", forgotPassword);

userRouter.put("/reset-pass/:id/:token", resetPassword);
