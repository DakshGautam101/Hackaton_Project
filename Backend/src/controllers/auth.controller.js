import { connectDB } from "../lib/ConnectDB.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
	try {
		await connectDB();
		const { email, password, username, imageUrl, phone, bio, role } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			email,
			password: hashedPassword,
			username,
			imageUrl: imageUrl || "",
			phone,
			bio,
			role
		});

		const token = generateToken(user._id);

		const userResponse = {
			_id: user._id,
			email: user.email,
			username: user.username,
			imageUrl: user.imageUrl,
			phone: user.phone,
			bio: user.bio,
			role: user.role
		};

		res.status(201).json({
			success: true,
			token,
			user: userResponse
		});
	} catch (error) {
		console.error("Error in signup:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

export const login = async (req, res, next) => {
	try {
		await connectDB();
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = generateToken(user._id);

		const userResponse = {
			_id: user._id,
			email: user.email,
			username: user.username,
			imageUrl: user.imageUrl,
			phone: user.phone,
			bio: user.bio,
			role: user.role
		};

		res.status(200).json({
			success: true,
			token,
			user: userResponse
		});
	} catch (error) {
		console.error("Error in login:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

export const handleProfile = async (req, res) => {
	try {
		await connectDB();

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
		 success: true,
		 user
		});
	} catch (error) {
		console.error("Error in profile:", error);
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
