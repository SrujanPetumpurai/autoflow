import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Providers
  await prisma.zapRunOutbox.deleteMany()
  await prisma.zapRun.deleteMany()
  await prisma.action.deleteMany()
  await prisma.trigger.deleteMany()
  await prisma.zap.deleteMany()
  await prisma.connectedAccount.deleteMany()
  await prisma.availableAction.deleteMany()
  await prisma.availableTrigger.deleteMany()
  await prisma.user.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.provider.createMany({
    data: [
      {
        id: 'google',
        name: 'Google',
        icon: 'https://www.google.com/favicon.ico',
        scopes: ['email', 'profile'],
        isActive: true
      },
      {
        id: 'github',
        name: 'GitHub',
        icon: 'https://github.com/favicon.ico',
        scopes: ['read:user', 'user:email'],
        isActive: true
      },
      {
        id: 'slack',
        name: 'Slack',
        icon: 'https://slack.com/favicon.ico',
        scopes: ['channels:read', 'chat:write'],
        isActive: true
      },
      {
        id: 'notion',
        name: 'Notion',
        icon: 'https://notion.so/favicon.ico',
        scopes: ['read_content', 'update_content'],
        isActive: true
      },
      {
        id:'gmail',
        name:"Gmail",
        icon:'https://img.icons8.com/color/1200/gmail-new.jpg',
        scopes:['send'],
        isActive:true
      }
    ],
    skipDuplicates: true
  })
 const triggers = [
  { id: "github_comment",  name: "GitHub - New Comment",      image: "https://github.com/favicon.ico",          summary: "Triggers when a new comment is added to an issue or pull request" },
  { id: "github_push",     name: "GitHub - New Push",         image: "https://github.com/favicon.ico",          summary: "Triggers when code is pushed to a repository" },
  { id: "github_pr",       name: "GitHub - New Pull Request", image: "https://github.com/favicon.ico",          summary: "Triggers when a new pull request is opened" },
  { id: "stripe_payment",  name: "Stripe - New Payment",      image: "https://stripe.com/favicon.ico",          summary: "Triggers when a new payment is received in Stripe" },
  { id: "gmail_received",  name: "Gmail - New Email",         image: "https://img.icons8.com/color/1200/gmail-new.jpg", summary: "Triggers when a new email arrives in your Gmail inbox" },
  { id: "schedule",        name: "Schedule",                  image: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png", summary: "Triggers at a specified time or on a recurring schedule" },
]
  // Available Triggers
  await prisma.availableTrigger.createMany({data:triggers})

  // Available Actions
  const emailAction = await prisma.availableAction.create({
    data: {
      id:'email',
      name: 'Email',
      image: 'https://cdn-icons-png.flaticon.com/512/561/561127.png',
      summary: 'Send an email to any address'
    }
  })

  const slackAction = await prisma.availableAction.create({
    data: {
      name: 'Send Slack Message',
      image: 'https://slack.com/favicon.ico',
      summary: 'Post a message to a Slack channel'
    }
  })

  const notionAction = await prisma.availableAction.create({
    data: {
      name: 'Create Notion Page',
      image: 'https://notion.so/favicon.ico',
      summary: 'Create a new page in a Notion database'
    }
  })
  // Users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      name: 'user1',
      email: 'user1@gmail.com',
      password: hashedPassword
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword
    }
  })

  // Connected Accounts
  await prisma.connectedAccount.createMany({
    data: [
      {
        userId: user1.id,
        providerId: 'google',
        accessToken: 'google_access_token_alice',
        refreshToken: 'google_refresh_token_alice',
        scope: 'email profile',
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
      },
      {
        userId: user1.id,
        providerId: 'github',
        accessToken: 'github_access_token_alice',
        scope: 'read:user user:email'
      },
      {
        userId: user2.id,
        providerId: 'slack',
        accessToken: 'slack_access_token_bob',
        scope: 'channels:read chat:write'
      },
      {
        userId:user1.id,
        providerId:'gmail',
        accessToken:'gmail_access_token_alias',
        scope:'send:email'

      }
    ]
  })

  // Zap for user1
  const zap1 = await prisma.zap.create({
    data: {
      userId: user1.id,
      trigger: {
        create: {
          triggerId:'github_comment',
          metadata: { url: 'https://hooks.example.com/trigger/1' }
        }
      },
      actions: {
        create: [
          {
            actionId: emailAction.id,
            sortingOrder: 0,
            metadata: { to: 'alice@example.com', subject: 'Zap triggered!' }
          },
          {
            actionId: slackAction.id,
            sortingOrder: 1,
            metadata: { channel: '#general', message: 'Webhook received!' }
          }
        ]
      }
    }
  })

  const zap2 = await prisma.zap.create({
    data: {
      userId: user2.id,
      trigger: {
        create: {
          triggerId: 'github_pr',
          metadata: { cron: '0 9 * * 1' } 
        }
      },
      actions: {
        create: [
          {
            actionId: notionAction.id,
            sortingOrder: 0,
            metadata: { database: 'Weekly Reports', title: 'Weekly Report' }
          }
        ]
      }
    }
  })

  // ZapRuns
  const zapRun1 = await prisma.zapRun.create({
    data: {
      zapId: zap1.id,
      metadata: { status: 'success', triggeredAt: new Date() }
    }
  })

  await prisma.zapRunOutbox.create({
    data: { zapRunId: zapRun1.id }
  })

  const zapRun2 = await prisma.zapRun.create({
    data: {
      zapId: zap2.id,
      metadata: { status: 'pending', triggeredAt: new Date() }
    }
  })

  await prisma.zapRunOutbox.create({
    data: { zapRunId: zapRun2.id }
  })

  console.log('✅ Seed complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })