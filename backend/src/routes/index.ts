import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/v1" , (req,res)=>{
    console.log('hehe');
    
});
