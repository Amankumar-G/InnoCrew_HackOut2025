import express from "express"
import leaderBoard from "../controller/leaderController.js"
import passport from "passport";

const router = express.Router();

router.get("/",passport.authenticate("jwt", { session: false }),leaderBoard);

export default router;