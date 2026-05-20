import "dotenv/config"
import {google} from 'googleapis'
import { prisma } from "./lib/db.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://zapier-clone.onrender.com/api/v1/gmail/callback' 
);

export async function sendEmail(to:string,body:string,userId:number|undefined){
    if(!userId){
        return 'no userId'
    }
        try {
            const account = await prisma.connectedAccount.findUnique({
                where: {
                    userId_providerId: {
                        userId:userId,
                        providerId: 'gmail'
                    }
                }
            });
            if(!account){
               return  console.log('no account found')
            }
            oauth2Client.setCredentials({
                access_token: account.accessToken,
                refresh_token: account.refreshToken,
                expiry_date: account.expiryDate?.getTime()??null,
            });
    
            const messageParts = [
                `To: ${to}`,
                'Content-Type: text/html; charset=utf-8',
                'MIME-Version: 1.0',
                'Subject: Automated Email',
                '',
                body,
            ];
            const message = messageParts.join('\n');
    
            const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
    
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
            const response = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });
            console.log("Worker email hit")
    
}catch(e){
    console.log(e)
}
}
