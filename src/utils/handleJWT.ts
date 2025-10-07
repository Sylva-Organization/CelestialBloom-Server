import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js"; // NodeNext: importa con .js


const { jwtSecret, jwtExpires } = config.jwt;

export interface JwtUserPayload extends JwtPayload {
  id: number | string;
  role: string;
}

/**
 * Firma un token con la información básica del usuario.
 * @param user objeto con id y role (puedes ampliar si necesitas más campos)
 */
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

/**
 * Verifica un token y devuelve su payload si es valido.
 * Si no lo es, devuelve null en lugar de lanzar error.
 */
export const verifyToken = async (
  token: string
): Promise<JwtUserPayload | null> => {
  try {
    if (!jwtSecret) throw new Error("JWT_SECRET not configured");
    return jwt.verify(token, jwtSecret) as JwtUserPayload;
  } catch(error) {
    return null;
  }
};
