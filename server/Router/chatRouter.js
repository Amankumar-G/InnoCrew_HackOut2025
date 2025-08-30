import express from "express"
import {chat} from "../controller/chatServices.js"
import passport from "passport";

const router = express.Router();

router.post("/",passport.authenticate("jwt", { session: false }),chat);

export default router;