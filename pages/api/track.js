// pages/api/track.js

export default async function handler(req, res) {
  const { tracking_number } = req.query;

  if (!tracking_number) {
    return res.status(400).json({ error: 'Missing tracking number' });
  }

  try {
    const response = await fetch('https://api.trackingmore.com/v4/trackings/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': process.env.TRACKINGMORE_API_KEY,
      },
      body: JSON.stringify({
        tracking_number, // no courier_code
      }),
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
