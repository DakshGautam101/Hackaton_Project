import fetch from 'node-fetch';

export const getDistance = async (req, res) => {
  const { origin, destination } = req.body;

  try {
    const response = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locations: [
          [origin.lng, origin.lat],        // Note: lng, lat order for ORS
          [destination.lng, destination.lat]
        ],
        metrics: ['distance', 'duration']
      })
    });

    const data = await response.json();
    const distance = data.distances[0][1]; // in meters
    const duration = data.durations[0][1]; // in seconds

    res.json({ distance, duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get distance' });
  }
};
