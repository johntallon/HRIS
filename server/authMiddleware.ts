import { ConfidentialClientApplication } from "@azure/msal-node";
import  { authConfig } from "./authConfig";

const msalClient = new ConfidentialClientApplication(authConfig);

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];
    try {
        const result = await msalClient.acquireTokenOnBehalfOf({
            oboAssertion: token,
            scopes: ["User.Read"], // Add the required scopes
        });
        req.user = result.account;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).send("Token validation failed");
    }
};
