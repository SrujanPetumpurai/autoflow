import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import {prisma} from '../lib/db.js'
const router = Router();

router.get('/',(req,res)=>{

})

export const zapRunRouter = router;