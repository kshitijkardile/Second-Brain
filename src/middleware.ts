import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      username?: string;
    }
  }
}

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers["authorization"];

  if (!headers) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const authHeader = Array.isArray(headers) ? headers[0] : headers;
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

  const secret = process.env.JWT_SECRET || "dev_access_secret";

  try {
    const decoded = jwt.verify(token as string, secret) as {
      id: string;
      username: string;
    };
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
