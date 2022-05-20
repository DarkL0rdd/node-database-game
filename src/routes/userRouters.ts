import router, { Application, Request, Response, Router } from "express";
import { registerUser } from "../controllers/register";

export const userRouter: Application = router();

userRouter.post("/register", registerUser);

/*router.get("/login");

router.put("/forgot-pass");//get?

router.put("/reset-pass");*/
