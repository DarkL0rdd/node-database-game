import router, { Application, Request, Response, Router } from "express";
import { registerUser, loginUser } from "../controllers/user_controllers";

export const userRouter: Application = router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

/*userRouter.put("/forgot-pass");//get?

userRouter.put("/reset-pass");*/
