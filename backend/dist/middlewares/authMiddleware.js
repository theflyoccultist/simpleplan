"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }
    const token = authHeader.split(' ')[1]; // Token is usually in the format 'Bearer <token>'
    try {
        // Verify the token using the JWT secret
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach the decoded token data (e.g., user info) to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
