import { Router } from "express";
import {prisma} from '../lib/db.js'
import { authMiddleware } from "../middleware.js";
const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.userId;

    const [providers, connected] = await Promise.all([
      prisma.provider.findMany({ where: { isActive: true } }),
      prisma.connectedAccount.findMany({
        where: { userId },
        select: { providerId: true }
      })
    ]);

    const connectedIds = new Set(connected.map(c => c.providerId));

    res.json(providers.map(p => ({
      ...p,
      isConnected: connectedIds.has(p.id)
    })));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
export const providerRouter = router

