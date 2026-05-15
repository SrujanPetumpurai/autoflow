# AutoFlow 🔁

> **Automate your workflows. Connect your tools. Focus on what matters.**

AutoFlow is an open-source workflow automation platform that lets you connect apps and services to create automated pipelines — triggered by real-world events, powered by a scalable event-driven architecture.

---

## What is AutoFlow?

AutoFlow lets you build **Flows** — automated pipelines that react to triggers and perform actions across your connected apps.

**Current Example Flow:**
```
GitHub Comment → Webhook → Queue → Worker → Automated Email
```

Whenever someone comments on your GitHub repository, AutoFlow captures the event, processes it through a reliable message queue, and automatically sends an email notification — without any manual intervention.

---

## Architecture

AutoFlow is built as a distributed system with four core services:

```
┌─────────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│   Frontend  │────▶│ Primary  │────▶│ Processor │────▶│  Worker  │
│  (React/UI) │     │ Backend  │     │           │     │          │
└─────────────┘     └──────────┘     └───────────┘     └──────────┘
                          │                │                  │
                          ▼                ▼                  ▼
                     PostgreSQL         Kafka            Email/Actions
                      (Prisma)        (Queue)
```

| Service | Responsibility |
|---|---|
| `frontend` | User interface for building and managing Flows |
| `hooks` | Receives incoming webhook events from external services |
| `primary-backend` | Core API — manages users, flows, triggers, actions |
| `processor` | Picks up Flow runs from DB and publishes them to Kafka |
| `worker` | Consumes from Kafka and executes actions (e.g. send email) |

---

## How a Flow Works

1. **Trigger** — An external event fires (e.g. a GitHub comment is posted)
2. **Hook** — The webhook listener receives the event and stores a `ZapRun` in the database
3. **Processor** — Polls the database, picks up new runs, and publishes them to a Kafka topic
4. **Worker** — Consumes messages from Kafka and executes the configured action (e.g. sends an email via Gmail)

This architecture ensures **reliability** (events are persisted before processing) and **scalability** (Kafka handles high-throughput event streams).

---

## Tech Stack

- **Frontend** — React
- **Backend** — Node.js
- **Database** — PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Message Queue** — Apache Kafka
- **Auth** — OAuth 2.0 (for connecting external accounts)

---

## Database Schema (Prisma)

AutoFlow uses the following core models:

| Model | Description |
|---|---|
| `User` | Registered users with connected accounts and flows |
| `Provider` | Supported integrations (e.g. GitHub, Gmail) |
| `ConnectedAccount` | OAuth tokens linking a user to a provider |
| `Zap` | A user's automation flow with trigger + actions |
| `Trigger` | The event that starts a flow (e.g. GitHub comment) |
| `Action` | A step that runs when the trigger fires (e.g. send email) |
| `AvailableTrigger` | Catalog of supported triggers |
| `AvailableAction` | Catalog of supported actions |
| `ZapRun` | A log of each time a flow was triggered |
| `ZapRunOutbox` | Outbox pattern — tracks runs pending processing |

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Apache Kafka
- npm / yarn

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/autoflow.git
cd autoflow

# 2. Install dependencies for each service
cd primary-backend && npm install
cd ../hooks && npm install
cd ../processor && npm install
cd ../worker && npm install
cd ../frontend && npm install

# 3. Set up environment variables
cp .env.example .env
# Add your DATABASE_URL, Kafka config, and OAuth credentials

# 4. Run database migrations
cd primary-backend
npx prisma migrate dev

# 5. Start all services
# In separate terminals:
npm run dev  # primary-backend
npm run dev  # hooks
npm run dev  # processor
npm run dev  # worker
npm run dev  # frontend
```

---

## Current Features

- [x] GitHub webhook trigger (fires on new comments)
- [x] Automated email action via worker
- [x] Event-driven pipeline with Kafka
- [x] Persistent run logging with outbox pattern
- [x] OAuth connected accounts
- [x] Multi-action flows with sort ordering

## Roadmap

- [ ] Full frontend UI for building flows visually
- [ ] More triggers (GitHub PRs, issues, stars)
- [ ] More actions (Slack, Discord, SMS)
- [ ] Flow run history and logs dashboard
- [ ] User dashboard with flow analytics

---

## Project Structure

```
autoflow/
├── frontend/          # React UI
├── hooks/             # Webhook listener service
├── primary-backend/   # Core REST API
├── processor/         # DB → Kafka publisher
└── worker/            # Kafka consumer + action executor
```

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

This is a personal portfolio project

---

*Built to learn and demonstrate event-driven architecture, webhook integrations, and scalable automation systems.*
