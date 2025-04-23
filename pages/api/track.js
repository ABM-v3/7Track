export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { trackingNumber, courierCode } = req.body;
  const apiKey = process.env.TRACKINGMORE_API_KEY;

  try {
    const response = await fetch('https://api.trackingmore.com/v4/trackings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': apiKey
      },
      body: JSON.stringify({
        tracking_number: trackingNumber,
        courier_code: courierCode || 'auto'
      })
    });

    const data = await response.json();

    if (data.meta.code !== 200) {
      return res.status(400).json({ error: data.meta.message });
    }

    const info = data.data;

    res.status(200).json({
      carrier: info.courier_code || 'Unknown',
      status: info.status || 'Pending',
      lastLocation: info.origin_info?.trackinfo?.slice(-1)[0]?.location || 'Unavailable'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
}
