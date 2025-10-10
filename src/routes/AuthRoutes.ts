import { Router } from "express";
import { register, login } from "../controllers/AuthController.js";

const AuthRouter = Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);

export default AuthRouter;