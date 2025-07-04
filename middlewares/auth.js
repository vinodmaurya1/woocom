const jwt = require("jsonwebtoken");
const Seller = require("../models/sellerModel");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "woo-com"|| process.env.JWT_SECRET);
        req.user = await Seller.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = authMiddleware;
