import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../Schema/User.js";

const secret = process.env.JWT_SECRET;
const router = express.Router();

router.get("/", async(req,res)=>{
  return res.send("Hello");
})
// ================== REGISTER ==================
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    location,
    organization, // only if project_owner/NGO
  } = req.body;

  try {
    console.log(secret)
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      location,
      organization: organization || null,
    });

    await newUser.save();

    const payload = { id: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        carbonCredits: user.carbonCredits,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});


// ================== PROFILE ==================
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select(
        "-password -__v -createdAt -updatedAt"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

// ================== INIT ADMIN ==================
router.get("/init-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const adminUser = new User({
      name: "Super Admin",
      email: "admin@mangrove.com",
      password: "admin123",
      role: "admin",
      verified: true,
    });

    await adminUser.save();

    const token = jwt.sign({ id: adminUser._id, role: "admin" }, secret, { expiresIn: "1d" });

    res.status(201).json({
      message: "Admin initialized successfully",
      admin: {
        id: adminUser._id,
        email: adminUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Init Admin Error:", error);
    res.status(500).json({ error: "Failed to initialize admin" });
  }
});

export default router;
