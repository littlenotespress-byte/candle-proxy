export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url, method, headers, body } = req.body;
    
    const finalHeaders = { ...headers };
    if (url && url.includes('anthropic.com')) {
      finalHeaders['x-api-key'] = process.env.ANTHROPIC_API_KEY;
      finalHeaders['anthropic-version'] = finalHeaders['anthropic-version'] || '2023-06-01';
    }

    const response = await fetch(url, {
      method: method || 'GET',
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(response.status).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
