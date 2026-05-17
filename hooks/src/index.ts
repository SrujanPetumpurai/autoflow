    import express from "express"
    import { PrismaClient,Prisma } from "@prisma/client";
    import cors from 'cors'
    import { triggerNormalizers } from "./normaliser.js";
    const client = new PrismaClient();;
    const app = express();
    app.use(cors())
    app.use(express.json());
    
    app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
        const userId = req.params.userId;
        const zapId = req.params.zapId;
        const body = req.body;
        console.log(`this is req.body, ${body}`)
        const zap = await client.zap.findFirst({
            where:{
                id:zapId
            },
            include:{
                trigger:{
                    select:{triggerId:true}
                }
            }
        })
        const triggerType = zap?.trigger?.triggerId
        if(!triggerType){
            return console.log("No trigger type in index.ts of hooks")
        }
        const normaliser = triggerNormalizers[triggerType]
        if(!normaliser){
            console.log(`No normalizer found for triggerType:${triggerType}`)
            return res.status(400).json({message:"Unsupported trigger type"})
        }
        const result = normaliser(body)
                console.log(`this is req.body, ${result}`)
        try{
            await client.$transaction(async (tx:Prisma.TransactionClient) => {
            const run = await tx.zapRun.create({
                data: {
                    zap:{connect:{id:zapId}},
                    metadata: result
                }
            });;

            await tx.zapRunOutbox.create({
                data: {
                    zapRun:{
                        connect:{id:run.id}
                    }
                }
            })
        })
        res.json({
            message: "Webhook received"
        })
        }catch(e){
            console.error("Transaction failed:", e)
            res.status(500).json({ message: "Unable to trigger the hook" })
        }
        
    })
    const PORT = process.env.PORT || 3002
    app.listen(PORT);
    console.log(`listening to ${PORT}`)