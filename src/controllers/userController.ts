import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { db } from "../lib/db";
import generateToken from "../utils/generateToken";

interface IGetUserAuthInfoRequest extends Request {
  user?: any; // or any other type
}

// description : Auth user/set token
// route : POST /api/users/auth
// public
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user.id);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// description : Register a new User
// route : POST /api/users/
// public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userExist = await db.user.findUnique({ where: { email } });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }
  const user = await db.user.create({
    data: { email, name, password: hashedPassword },
  });
  if (user) {
    generateToken(res, user.id);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
  res.status(200).json({ message: "Register user" });
});

// description : Logout user
// route : POST /api/users/logout
// public
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
});

// description : Get User Profile
// route : GET /api/users/profile
// private
const getUserProfile = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    res.status(200).json(user);
  }
);

// description : Update Usere Profile
// route : PUT /api/users/auth
// private
const updateUserProfile = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const currentUser = await db.user.findUnique({
        where: { id: req.user.id },
      });

      if (!currentUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const updatedUser = await db.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          name: req.body.name,
        },
      });
      res.status(200).json({ id: updatedUser.id, name: updatedUser.name });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
