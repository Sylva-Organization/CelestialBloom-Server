import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js"; 


const { jwtSecret, jwtExpires } = config.jwt;

export interface JwtUserPayload extends JwtPayload {
  id: number;
  role: string;
}

//signed token with basic user information.
 
export const tokenSign = async (
  user: Pick<JwtUserPayload, "id" | "role">
): Promise<string> => {
  if (!jwtSecret) throw new Error("JWT_SECRET not configured");

  const sign = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: jwtExpires || "2h",
    }
  );

  return sign;
};

//verified token and return payload if it is valid 

export const verifyToken = async (
  token: string
): Promise<JwtUserPayload | string | null> => {
  try {
    if (!jwtSecret) throw new Error("JWT_SECRET not configured");
    const decodeToken = jwt.verify(token, jwtSecret) as JwtUserPayload;
    return decodeToken;
  } catch(error) {
    return null;
  }
};
