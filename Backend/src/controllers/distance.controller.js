import axios from 'axios';

export const getDistance = async (req, res) => {
  const { origin, destination } = req.body;

  try {
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/matrix/driving-car',
      {
        locations: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat]
        ],
        metrics: ['distance', 'duration']
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;
    res.json({
      distance: data.distances[0][1],
      duration: data.durations[0][1]
    });
  } catch (error) {
    console.error('ORS error:', error);
    res.status(500).json({ error: 'Distance calculation failed' });
  }
};
