// pages/api/track.js
export default async function handler(req, res) {
  const { tracking_number } = req.query;

  if (!tracking_number) {
    return res.status(400).json({ error: 'Missing tracking number' });
  }

  try {
    // STEP 1: Detect the courier
    const detectResponse = await fetch('https://api.trackingmore.com/v4/carriers/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': process.env.TRACKINGMORE_API_KEY,
      },
      body: JSON.stringify({ tracking_number }),
    });

    const detect = await detectResponse.json();

    // STEP 2: Validate result
    if (!detect.data || detect.data.length === 0 || !detect.data[0].code) {
      return res.status(400).json({
        error: 'Could not detect courier',
        debug: detect,
      });
    }

    const courier_code = detect.data[0].code;

    // STEP 3: Track the package
    const trackingResponse = await fetch('https://api.trackingmore.com/v4/trackings/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': process.env.TRACKINGMORE_API_KEY,
      },
      body: JSON.stringify({
        tracking_number,
        courier_code,
      }),
    });

    const trackingData = await trackingResponse.json();

    res.status(trackingResponse.status).json(trackingData);
  } catch (error) {
    console.error('TRACKING ERROR:', error);
    res.status(500).json({ error: 'Internal server error', debug: error.message });
  }
}
