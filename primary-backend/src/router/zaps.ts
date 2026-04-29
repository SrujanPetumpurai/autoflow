
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { ZapCreateSchema } from "../types/index.js";
import {prisma} from '../lib/db.js'
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id: string = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);
    
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }   
    const {availableTriggerId,actions} = parsedData.data;
        const zapId = await prisma.$transaction(async (tx:any) => {
            const zap = await tx.zap.create({
                data: {
                    //@ts-ignore
                    userId: Number(req.id),
                    trigger: {
                        create: {
                            type:{
                                connect:{id:availableTriggerId}
                            },
                        metadata: parsedData.data.triggerMetadata,
                        },
                },
                    actions: {
                        create: actions.map((x, index) => ({
                            sortingOrder: index,
                            metadata: x.actionMetadata,
                            type:{
                                connect:{id:x.availableActionId}
                            }
                        }))
                    }
                }
            })
            return zap.id;

        })
        return res.json({
            zapId
        })
    })

router.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId as string,
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            },
            zapRuns: {
                orderBy: {
                    id: "desc"
                }
            }
        }
    });

    return res.json({ zap });
});

export const zapRouter = router;