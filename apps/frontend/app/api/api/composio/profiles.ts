import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'https://suna-backend.onrender.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { toolkit_slug, is_active } = req.query;
    const params = new URLSearchParams();

    if (toolkit_slug) params.append('toolkit_slug', toolkit_slug as string);
    if (is_active !== undefined) params.append('is_active', is_active as string);

    const backendUrl = `${BACKEND_URL}/api/composio/profiles${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Proxying to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { authorization: req.headers.authorization }),
      },
      ...(req.method === 'POST' && { body: JSON.stringify(req.body) }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend error:', response.status, data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
