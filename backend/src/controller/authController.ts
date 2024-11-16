import { Request, Response } from "express";
import  jwt  from "jsonwebtoken"
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
type newUser = typeof usersTable.$inferInsert & {id: number};

const signToken = (id: any) => {
    
    return jwt.sign({id}, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '7d'
    })
}

export const signup = async (req : Request, res: Response) => {

    const {name, email, password} = req.body
    try {
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            res.status(400).json({ error: "validation_error", message: "Name is required" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
            res.status(400).json({ error: "validation_error", message: "Email is missing or invalid" });
            return;
        }

        if(!password){ 
            res.status(400).json({error: "validation_error",message: "Password is required" });
            return;
        }

        if(password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password much be more than 6 character"
            });
            return;
        }

        const newUserArray = await db.insert(usersTable).values({
            name,
            email,
            password
        }).returning();

        console.log(newUserArray);
        
        const newUser: newUser = newUserArray[0];

        if (!newUser) {
            res.status(400).json({ success: false, message: "User creation failed" });
            return;
        }

        const token = signToken(newUser?.id);

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({
            success: true,
            user: newUser,
        })
        return;
        
    } catch (error) {
        console.log('Error while signup', error);
        res.status(500).json({
            success: false,
            message: 'Error in signup'
        })
        return;
        
    }
};

export const login = async (req : Request, res: Response) => {
    const {email , password} = req.body;

    try {

        if(!email || !password){
            res.status(400).json({
                success: false,
                message: 'All field are necessary'
            });
            return;
        }

        const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .execute();

        if (!user || user.length === 0) {
            res.status(400).json({
                success: false,
                message: "Invalid email",
            });
            return;
        }

        const foundUser = user[0];
        //password matching
        if(foundUser.password !== password) {
            res.status(400).json({
                success: false,
                message: "Invalid password"
            });
            return;
        }
                

        const token = signToken(foundUser?.id);

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            success: true,
            foundUser
        });
        return;
        
    } catch (error) {
        console.log('Error while logging', error);
        res.status(500).json({
            status: false,
            message: 'Error while logginging'
        });
        return;
    }
};

export const logout = async (req : Request, res: Response) => {
    res.clearCookie('jwt');
    res.status(200).json({
        success: true,
        message: "logged out successfully"
    });
    return;
};

export const getme = async (req: Request , res : Response) => {
    try {
        res.send({
            success: true,
            user: req.user
        })
        return;
    } catch (error) {
        console.log('Error in server');
        res.send({
            success: false,
            message: "Error in server"
        })
        return;
    }
}
