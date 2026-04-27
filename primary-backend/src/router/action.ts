import { Router } from "express";
import {prisma} from '../lib/db.js'
const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await prisma.availableAction.findMany({
        select:{
            id:true,
            name:true,
            image:true,
            summary:true,
        }
    });
    res.json({
        availableActions
    })
});

export const actionRouter = router;