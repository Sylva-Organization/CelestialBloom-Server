import type { Request, Response, NextFunction } from 'express';
// import { verifyToken, type JwtUserPayload } from '../utils/handleJWT.js';

// declare global {
//   namespace Express {
//     interface Request {
//       auth?: Pick<JwtUserPayload, "id" | "role">;
//     }
//   }
// }

// function getBearerToken(req: Request): string | null {
//   const auth = req.headers.authorization;
//   if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
//   return null;
// }

// export async function requireAuth(req: Request, res: Response, next: NextFunction) {
//   const token = getBearerToken(req);
//   if (!token) return res.status(401).json({ message: "Missing token" });

//   const payload = await verifyToken(token);
//   if (!payload) return res.status(401).json({ message: "Invalid or expired token" });

//   req.auth = { id: payload.id, role: payload.role };
//   next();
// }

// export function requireRole(...roles: string[]) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
//     if (!roles.includes(req.auth.role)) return res.status(403).json({ message: "Forbidden" });
//     next();
//   };
// }
