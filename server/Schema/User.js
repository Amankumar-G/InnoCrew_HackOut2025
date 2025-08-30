// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["community_member", "admin"],
    default: "community_member"
  },

  // Gamification
  points: { type: Number, default: 0 },
  badges: [{ type: String }],

  // Carbon credit accounting
  carbonCredits: {
    earned: { type: Number, default: 0 },
    sold: { type: Number, default: 0 }
  },

  // Project owner specific info
  organization: { type: String },
  
  // Optional community metadata
  location: { type: String },
  phone: { type: String }
}, { timestamps: true });

UserSchema.index({ role: 1 });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
