const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId, text) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}

export default async function handler(req, res) {
  const message = req.body.message;
  const chatId = message.chat.id;

  if (message.text === '/start') {
    await sendMessage(chatId, 'Welcome! Send a tracking number or type /help for assistance.');
    return res.status(200).end();
  }

  if (message.text === '/help') {
    await sendMessage(chatId, `Send a tracking number (e.g., "YT1234567890").\nYou can also use the website: https://your-vercel-app.vercel.app`);
    return res.status(200).end();
  }

  if (message.text === '/website') {
    await sendMessage(chatId, 'Visit the website: https://your-vercel-app.vercel.app');
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://api.trackingmore.com/v4/trackings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': process.env.TRACKINGMORE_API_KEY
      },
      body: JSON.stringify({
        tracking_number: message.text,
        courier_code: 'auto'
      })
    });

    const data = await response.json();

    if (!data.data) throw new Error();

    const info = data.data;
    const reply = `\u{1F4E6} *Carrier:* ${info.courier_code}\n✅ *Status:* ${info.status}\n📍 *Last Location:* ${info.origin_info?.trackinfo?.slice(-1)[0]?.location || 'N/A'}`;
    await sendMessage(chatId, reply);
  } catch (e) {
    await sendMessage(chatId, '❌ Could not find tracking info. Please check the number and try again.');
  }

  res.status(200).end();
}
