export default async function handler(req, res) {
  const tracking_number = req.query.tracking_number;

  if (!tracking_number) {
    return res.status(400).json({ error: 'Missing tracking number' });
  }

  // You may use auto-detection or hardcode a courier here
  const response = await fetch('https://api.trackingmore.com/v4/carriers/detect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Tracking-Api-Key': process.env.TRACKINGMORE_API_KEY,
    },
    body: JSON.stringify({ tracking_number }),
  });

  const detect = await response.json();

  if (!detect.data || !detect.data[0]?.code) {
    return res.status(400).json({ error: 'Could not detect courier' });
  }

  const courier_code = detect.data[0].code;

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
}
