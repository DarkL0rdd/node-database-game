import router, { Application } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUsers,
} from "../controllers/user.controllers";
import { checkRefreshToken } from "../middleware/authorization.JWT";

export const userRouter: Application = router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

userRouter.post("/forgot-password", forgotPassword);

userRouter.get("/reset-password/:link", resetPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.get("/users", getUsers);
