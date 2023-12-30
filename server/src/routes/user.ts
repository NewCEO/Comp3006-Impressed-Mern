import { Router, Request, Response, NextFunction } from "express";
import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../common/error";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';


const router = Router();

router.post("/register", async (request, response) => {
  const { username, password } = request.body;

  console.log("Attempting to register user with usernames:", username);
  console.log("Received registration request. Request body:", request.body);


  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return response.status(400).json({ type: UserErrors.Username_Already_Exists });
    }

    
    if (!password) {
      return response.status(400).json({ type: UserErrors.Wrong_Credentials });
    }

    // Generate a salt
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw err; 
      }

     
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          throw err; 
        }

        // Save the user with the hashed password
        const newUser = new UserModel({
          username,
          password: hash,
        });
        await newUser.save();

        response.json({
          message: "User Registered Successfully"
        });
      });
    });
  } catch (err) {
    response.status(500).json({ type: err });
  }
});



router.post("/login", async (request, response) => {
  const { username, password } = request.body;

  try {
    const user = (await UserModel.findOne({ username })) as IUser;

    if (!user) {
      return response.status(400).json({ error: "No user found with the provided username" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({ error: "Wrong username/password combination" });
    }

    const token = jwt.sign({ id: user._id }, "secret");
    response.json({ token, userID: user._id });
  } catch (err) {
    console.error("Login Error:", err);  // Log the full error for debugging
    response.status(500).json({ error: "Internal server error" });
  }
});

export const verifyToken = (request, response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        console.error("Token Verification Error:", err);
        return response.sendStatus(403);
      }
      next();
    });
  } else {
    return response.sendStatus(401);
  }
};


router.get("/available-money/:userID", verifyToken, async (request, response) => {
  const { userID } = request.params;

  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return response.status(400).json({ type: UserErrors.No_User_Found });
    }

    response.json({ availableMoney: user.availableMoney });
  } catch (err) {
    response.status(500).json({ type: err });
  }
});

export { router as userRouter };
