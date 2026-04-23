
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { SigninSchema, SignupSchema } from "../types/index.js";
import {prisma} from '../lib/db.js'
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";
import bcrypt from "bcrypt";

const router = Router();
const saltRounds = 10;
router.get("/test",(req,res)=>{
    return res.json({message:"test working"})
})
router.post("/signup", async (req, res) => {
    
    const body = req.body;

    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(411).json({ message: "Incorrect inputs" });
    }

    try {
        const userExists = await prisma.user.findFirst({  
            where: { email: parsedData.data.username }
        });

        if (userExists) {
            return res.status(403).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, saltRounds);
        
        await prisma.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        });

        return res.json({ message: "Please verify your account by checking your email" });

    } catch(e) {
        console.error("Signup error:", e); 
        return res.status(500).json({
            message: "Error while creating account",
            error: (e as Error).message     
        });
    }
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    try{
        const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.username,
        }
    });
    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }
    const isMatch = await bcrypt.compare(parsedData.data.password,user.password)
    if(!isMatch){
        return res.json({
            message:"Sorry credentials are incorrect",
            status:400
        })
    }
    // sign the jwt
    const token = jwt.sign({
        id: user.id
    }, JWT_PASSWORD);

    res.json({
        token: token,
    });
    }catch(e){
        return res.json({
            message:"Not able to signin Sorry",e
        })
    }
    
})

router.get("/", authMiddleware, async (req, res) => {
    // TODO: Fix the type
    // @ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });

    return res.json({
        user
    });
})

export const userRouter = router;