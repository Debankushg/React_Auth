
import jwt from 'jsonwebtoken'
import ENV from '../config.js'




export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];

        // Check if the token is present
        if (!token) {
            return res.status(401).json({ error: "Authentication Failed: Token is missing" });
        }

        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET)
        req.user = decodedToken

        // res.json(decodedToken)
        // Perform any additional authentication logic here

        // If everything is fine, you can pass control to the next middleware
        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed: " + error.message });
    }
}


export async function localVariables(req, res, next) {
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next()
}





