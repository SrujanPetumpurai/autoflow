

import { Router } from "express";
import {prisma} from '../lib/db.js'

const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await prisma.availableTrigger.findMany({
        select:{
            id:true,
            name:true,
            image:true,
            summary:true,
        }
    });
    res.json({
        availableTriggers
    })
});

export const triggerRouter = router;