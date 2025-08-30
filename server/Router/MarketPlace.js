import express from "express"
import {marketPlace} from "../controller/marketPlace.js"

const router = express.Router();

router.get("/",marketPlace);

export default router;