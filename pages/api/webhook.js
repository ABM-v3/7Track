// pages/api/webhook.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body;

  // You can verify the webhook signature here if needed
  console.log('📬 Webhook received:', JSON.stringify(body, null, 2));

  // Optionally: store in DB or notify via Telegram bot here

  return res.status(200).json({ message: 'Webhook received' });
}
