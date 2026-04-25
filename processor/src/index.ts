import { PrismaClient } from '@prisma/client'
import { Kafka } from 'kafkajs'
import express from 'express';

const TOPIC_NAME = 'zap-events'
const app = express();
const client = new PrismaClient()

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: [process.env.KAFKA_BROKER!],
    connectionTimeout: 10000,
    requestTimeout: 30000,
    ssl: {
        rejectUnauthorized: false
    },
    sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
    }
})

async function runProcessor() {
    const producer = kafka.producer();
    await producer.connect();
    console.log("Kafka producer connected")

    try {
        while (true) {
            try {
                await client.$transaction(async (tx) => {
                    const pendingRows = await tx.zapRunOutbox.findMany({
                        where: {},
                        take: 10
                    })

                    if (pendingRows.length === 0) return;

                    console.log(`Processing ${pendingRows.length} rows`)

                    await producer.send({
                        topic: TOPIC_NAME,
                        messages: pendingRows.map((r: any) => ({
                            value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
                        }))
                    })

                    await tx.zapRunOutbox.deleteMany({
                        where: {
                            id: {
                                in: pendingRows.map((x: any) => x.id)
                            }
                        }
                    })

                    console.log(`Processed and deleted ${pendingRows.length} rows`)
                })
            } catch (e) {
                console.error("Error in processing loop:", e)
            }

            await new Promise(r => setTimeout(r, 3000));
        }
    } finally {
        await producer.disconnect()
        console.log("Producer disconnected")
    }
}

async function main() {
    while (true) {
        try {
            await runProcessor()
        } catch (e) {
            console.error("Processor crashed, restarting in 5s:", e)
            await new Promise(r => setTimeout(r, 5000))
        }
    }
}

main();

app.get('/health', (req, res) => res.send('ok'))
app.listen(process.env.PORT || 3000, () => {
    console.log(`Health check listening on port ${process.env.PORT || 3000}`)
})