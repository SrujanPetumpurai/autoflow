import express from "express";
import { userRouter } from "./router/user.js";
import { zapRouter } from "./router/zaps.js";
import cors from "cors";
import { triggerRouter } from "./router/trigger.js";
import { actionRouter } from "./router/action.js";
import { googleRouter } from "./router/google.js";
import { connectedAccount } from "./router/connectedAccounts.js";
import { providerRouter } from "./router/provider.js";
import { gmailRouter } from "./router/gmail.js";
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
    "https://hoppscotch.io",
  process.env.FRONTEND_URL!,
];
app.use(express.json());
app.use(cors({
    origin: true,  // reflects whatever origin the request comes from
    credentials: true,
}))

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/provider",providerRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use('/api/v1/connectedAccount',connectedAccount)
app.use("/api/v1/action", actionRouter);
app.use("/api/v1/google",googleRouter)
app.use("/api/v1/gmail",gmailRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Listening on ${PORT}`);
