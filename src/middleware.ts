import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
         
export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
        
    // const theuserid = req.body.userId;
        // const header = req.headers["authorization"];    
        const header = req.headers["authorization"];    
        // const token = header && header.split(" ")[1]; // Extract token from "Bearer <token>"
    
    const decoded = jwt.verify(header as string, JWT_PASSWORD); 
    if (decoded) { 
        if (typeof decoded === "string") {  
            console.log("Some problem in decoding!");
            res.status(403).json({
                message: "You are not logged in"
            })
            return;                            
        }
                                               
    req.userId = (decoded as JwtPayload).id;
    console.log(req.userId);
       console.log("Above is the req.userId");
       console.log("below");   
       console.log(req.body.link);
       console.log("above");
        next();
}   
}


