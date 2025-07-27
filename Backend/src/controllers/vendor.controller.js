// controllers/vendor.controller.js
import { connectDB } from "../lib/ConnectDB.js";
import { User } from "../models/user.model.js";

export const getNearbyUsers = async (req, res) => {
  try {
    await connectDB();

    const { lat, lng, role = "Vendor", radius = 5 } = req.query; // radius in kilometers

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Latitude and longitude required" });
    }

    const users = await User.find({
      role,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    }).select("-password");

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
