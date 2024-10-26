import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
  userId: number; // Adjust based on your JWT payload
}

interface IGetUserAuthInfoRequest extends Request {
  user?: any; // or any other type
}

const protect = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as DecodedToken;

        const user = await db.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, name: true, email: true }, // Only select the fields you need
        });

        if (!user) {
          res.status(401);
          throw new Error("User not found");
        }

        // Attach user data to the request object
        req.user = user;

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, Invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export { protect };
