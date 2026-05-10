import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRATE || "default_secret";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
