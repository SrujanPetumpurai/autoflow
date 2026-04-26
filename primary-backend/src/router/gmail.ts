import { Router } from "express";
import {prisma} from '../lib/db.js'
import {google} from 'googleapis'
import { authMiddleware } from "../middleware.js";

const router = Router();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://zapier-clone-rho.vercel.app/api/v1/gmail/callback' 
);
console.log("Env variables",process.env.GOOGLE_CLIENT_ID)
console.log("ABove me should be env variables")

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

router.get('/auth', authMiddleware,(req, res) => {
    try{
    const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',  
    scope: SCOPES,
    prompt: 'consent',
    //@ts-ignore
    state:req.id 
  });
  res.json({url:authUrl});
}catch(e){
    res.json({message:"Unable to send u to google gmail consent page"})
}
});


router.get('/callback',async(req,res)=>{
        const {code,state} = req.query;
        if (!code || !state) {
        res.status(400).json({ error: 'Missing code or state' });
        return;
}
        const userId = parseInt(state as string, 10);
        if (isNaN(userId)) {
            res.status(400).json({ error: 'Invalid state/userId' });
            return;
            }
        try{
            const {tokens} = await oauth2Client.getToken(code as string);
            if (!tokens.access_token) {
            res.status(400).json({ error: 'No access token received' });
            return;
            }
            await prisma.connectedAccount.upsert({
                where:{
                    userId_providerId:{
                        userId:userId,
                        providerId:'gmail'
                    },
                },
                update:{
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token??null,
                        expiryDate:tokens.expiry_date? new Date(tokens.expiry_date):'',
                    },
                create:{
                    user:{
                        connect:{
                        id:userId}},
                    provider:{
                        connect:{id:'gmail'}
                    } ,
                    accessToken: tokens.access_token!,         
                    refreshToken: tokens.refresh_token ?? null,
                    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) :null,
                }
            })
            return(
                res.redirect('https://zapier-clone-rho.vercel.app/zap/create') 
        )
        }catch(e){
            console.error(e);
            res.status(500).json({message:"auth failed"})
        }
    });

export const gmailRouter = router;