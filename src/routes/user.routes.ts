import router, { Application, Request, Response, Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  //forgotPassword,
  //resetPassword,
} from "../controllers/user.controllers";

export const userRouter: Application = router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

//router.get(/refresh);

/*userRouter.post("/forgot-pass", forgotPassword);

userRouter.put("/reset-pass/:id/:token", resetPassword);*/
