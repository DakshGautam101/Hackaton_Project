export const captureLocation = (req, res, next) => {
  const location = req.body.location;

  if (!location || !location.type || !Array.isArray(location.coordinates)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing location data (GeoJSON 'Point' required)"
    });
  }

  next();
};