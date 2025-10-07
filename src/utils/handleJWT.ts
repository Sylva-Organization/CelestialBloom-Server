// src/utils/handleJWT.ts
import config from "../config/config.js"; // 👈 con NodeNext, importa .js aunque este archivo sea .ts
import jwt from 'jsonwebtoken';


const { jwtSecret, jwtExpires } = config.jwt;

// Define el payload que pones dentro del token
export type JwtUserPayload = {
  id: number | string;
  role: string;
} & jwt.JwtPayload;

// Garantiza en tiempo de ejecución que hay secreto
function ensureSecret(secret: string): asserts secret is string {
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }
}

/**
 * Firma un token con el payload del usuario.
 * Ejemplo de uso: signToken({ id: user.id, role: user.role })
 */
export function signToken(payload: Omit<JwtUserPayload, "iat" | "exp">): string {
  ensureSecret(jwtSecret);
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });
}

/**
 * Verifica un token. Devuelve el payload si es válido; si no, null.
 */
export function verifyToken<T extends jwt.JwtPayload = JwtUserPayload>(token: string): T | null {
  try {
    ensureSecret(jwtSecret);
    return jwt.verify(token, jwtSecret) as T;
  } catch {
    return null;
  }
}

/**
 * Decodifica sin verificar (útil para debug; no usar para auth).
 */
export function decodeToken(token: string): jwt.JwtPayload | null {
  return jwt.decode(token) as jwt.JwtPayload | null;
}

// comparar register 
    const token = signToken({ id: user.id, role: user.role });
    const safe = await UserModel.findByPk(user.id, { attributes: { exclude: ["password"] } });

    return res.status(201).json({ data: safe, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// login auth comparar
const token = signToken({ id: user.id, role: user.role });
    const safe = await UserModel.findByPk(user.id, { attributes: { exclude: ["password"] } });

    return res.status(200).json({ data: safe, token });