import { Kafka } from 'kafkajs'
import { PrismaClient } from '@prisma/client'
import type { JsonObject } from '@prisma/client/runtime/library';
import { parse } from './parser.js';
import { sendEmail } from './email.js';
import { sendSol } from './solana.js';
import express from 'express'

const TOPIC_NAME = "zap-events"
const app = express();
const prismaClient = new PrismaClient();

const kafka = new Kafka({
    clientId: 'kafka-consumer',
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

async function runWorker() {
    const consumer = kafka.consumer({ groupId: 'main-worker' })
    const producer = kafka.producer();

    await producer.connect();
    await consumer.connect();
    console.log("Kafka consumer and producer connected")

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })

            const commit = () => consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])

            if (!message.value?.toString()) {
                console.log("Empty message, skipping")
                await commit()
                return
            }

            const parsedMessage = JSON.parse(message.value.toString())
            const zapRunId: string = parsedMessage.zapRunId
            const stage: number = parsedMessage.stage

            const zapRun = await prismaClient.zapRun.findFirst({
                where: { id: zapRunId },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: { type: true },
                                orderBy: { sortingOrder: 'asc' }
                            }
                        }
                    }
                }
            })

            if (!zapRun) {
                console.log(`ZapRun ${zapRunId} not found, skipping`)
                await commit()
                return
            }

            const currentAction = zapRun.zap.actions.find(x => x.sortingOrder === stage)

            if (!currentAction) {
                console.log(`No action found for stage ${stage}, skipping`)
                await commit()
                return
            }

            const metadata = zapRun.metadata as JsonObject
            const userId = zapRun.zap.userId

            console.log(`Executing stage ${stage}, actionId: ${currentAction.actionId}`)

            try {
                if (currentAction.actionId === 'email') {
                    const emailTemplate = (currentAction.metadata as JsonObject)?.email as string
                    const bodyTemplate = (currentAction.metadata as JsonObject)?.body as string

                    if (!emailTemplate || !bodyTemplate) {
                        console.log("Missing email or body template, skipping")
                        await commit()
                        return
                    }

                    const to = parse(emailTemplate, metadata )
                    const body = parse(bodyTemplate, metadata )

                    console.log(`Sending email to: ${to}`)
                    await sendEmail(to, body, userId)
                }

                if (currentAction.actionId === 'send-sol') {
                    const amountTemplate = (currentAction.metadata as JsonObject)?.amount as string
                    const addressTemplate = (currentAction.metadata as JsonObject)?.address as string

                    const amount = parse(amountTemplate, metadata )
                    const address = parse(addressTemplate, metadata )

                    console.log(`Sending ${amount} SOL to ${address}`)
                    await sendSol(amount, address)
                }

                const lastStage = zapRun.zap.actions.length - 1
                if (stage < lastStage) {
                    console.log(`Stage ${stage} done, pushing stage ${stage + 1} to queue`)
                    await producer.send({
                        topic: TOPIC_NAME,
                        messages: [{
                            value: JSON.stringify({
                                zapRunId,
                                stage: stage + 1
                            })
                        }]
                    })
                } else {
                    console.log(`All ${lastStage + 1} stages completed for zapRun ${zapRunId}`)
                }

                await commit()
                console.log(`Stage ${stage} committed`)

            } catch (e) {
                console.error(`Error processing stage ${stage} for zapRun ${zapRunId}:`, e)
            }
        }
    })
}

async function main() {
    while (true) {
        try {
            await runWorker()
        } catch (e) {
            console.error("Worker crashed, restarting in 5s:", e)
            await new Promise(r => setTimeout(r, 5000))
        }
    }
}

main().catch(console.error)

app.get('/health', (req, res) => res.send('ok'))
app.listen(process.env.PORT || 3000, () => {
    console.log(`Worker health check on port ${process.env.PORT || 3000}`)
})