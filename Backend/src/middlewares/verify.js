import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - you must be logged in" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;
		req.auth = { userId: user._id }; // Add this line to maintain compatibility with existing code
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export const requireAdmin = async (req, res, next) => {
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};

// Middleware to restrict access to supplier only
export const requireSupplier = async (req, res, next) => {
	try {
		if (req.user.role !== 'Supplier') {
			return res.status(403).json({ message: "Unauthorized - only suppliers can access this resource" });
		}
		next();
	} catch (error) {
		next(error);
	}
};

// Middleware to restrict access to vendor only
export const requireVendor = async (req, res, next) => {
	try {
		if (req.user.role !== 'Vendor') {
			return res.status(403).json({ message: "Unauthorized - only vendors can access this resource" });
		}
		next();
	} catch (error) {
		next(error);
	}
};