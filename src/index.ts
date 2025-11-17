import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserModel } from "./db.js";

const saltOrRounds = 10;

const signupSchema = z.object({
  Username: z.string().min(1, "Username is required"),
  Password: z.string().min(6, "Password must be at least 6 characters"),
});

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  try {
    const { Username, Password } = signupSchema.parse(req.body);

    const hash = await bcrypt.hash(Password, saltOrRounds);
    await UserModel.create({
      Username: Username,
      Password: hash,
    });

    res.status(201).send("User created");
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    if (!Username || !Password) {
      return res.status(400).json({ error: "Username and Password required" });
    }

    const user = await UserModel.findOne({ Username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare provided password with stored (expected hashed) password
    const passwordMatches = await bcrypt.compare(Password, user.Password);
    if (!passwordMatches)
      return res.status(401).json({ error: "Invalid credentials" });

    const payload = { id: user._id, username: user.Username };

    const ACCESS_SECRET = process.env.JWT_SECRET || "dev_access_secret";
    const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev_refresh_secret";

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // domain: process.env.COOKIE_DOMAIN // optional
    });

    // Return minimal user info + access token
    return res.json({
      message: "Signed in",
      accessToken,
      user: { id: user._id, Username: user.Username },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/pi/v1/content", async (req, res) => {});

app.delete("/api/v1/content", async (req, res) => {});

app.listen(3000);
console.log("server started in port 3000");
