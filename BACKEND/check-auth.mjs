import jwt from "jsonwebtoken";

const checkauth = (req, res, next) => {
    try {
        // Correctly extract the token from the authorization header
        const token = req.headers.authorization.split(" ")[1];
        
        // Verify the token
        jwt.verify(token, "this_secret_should_be_longer_than_it_is");
        
        // If verification is successful, pass control to the next handler
        next();
    } catch (error) {
        res.status(401).json({
            message: "Token invalid"
        });
    }
};

export default checkauth;
