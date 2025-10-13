import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../utils/handleJWT.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "NEED_SESSION" });
        }
        const userToken = <string>req.headers.authorization.split(" ").pop()
        const dataToken = await verifyToken(userToken)
        
        if (dataToken !== null && typeof dataToken !== "string") {            
            const user = await UserModel.findByPk(dataToken.id)
            req.body.user = user
            next()

        }

    } catch (error:any) {
        res.status(401).json({ error: "NOT_SESSION", message: error.message })
    }
};