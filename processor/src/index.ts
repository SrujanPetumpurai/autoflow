import {PrismaClient} from '@prisma/client'
import {Kafka} from 'kafkajs'
import express from 'express';
const TOPIC_NAME = 'zap-events'

const app = express();

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: [process.env.KAFKA_BROKER!],
    ssl: {
        rejectUnauthorized: false
    },
    sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
    }
})
const client = new PrismaClient()

async function main(){
    const producer = kafka.producer();
    await producer.connect();
    console.log("inside process main function")
    while(1){
        const pendingRows = await client.zapRunOutbox.findMany({
            where:{},
            take:10
        })
        console.log(pendingRows)
        if (pendingRows.length === 0) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
}
        await producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map((r:any)=>{
                return{
                    value: JSON.stringify({zapRunId: r.zapRunId, stage: 0})
                }
            })
        })
        await client.zapRunOutbox.deleteMany({
            where:{
                id:{
                    in: pendingRows.map((x:any) => x.id)
                }
            }
        })
        await new Promise(r => setTimeout(r, 3000));
    }
}

main();
app.get('/health', (req, res) => res.send('ok'))
app.listen(process.env.PORT || 3000)    