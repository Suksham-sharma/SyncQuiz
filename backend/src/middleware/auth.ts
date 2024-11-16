
import  jwt  from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { usersTable } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const protectRoute = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const token = req.cookies.jwt

        if(!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized - No Token'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as {id: string};

        if(!decoded) {
            res.status(401).json({
                success: false,
                message: 'Not autorized - invalid token'
            });
            return;
        }

        const currentUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, Number(decoded.id)))
        .execute();

        req.user = currentUser[0];
        

        next();

    } catch (error) {
        console.log('Error while getting user details');
        if( error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Not authorized - Invalid token'
            })
            return;
        } else{
            res.status(500).json({
                success: false,
                message: 'Error in server'
            })
            return;
        }
    }
}