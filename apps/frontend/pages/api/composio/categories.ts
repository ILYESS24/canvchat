import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'https://suna-backend.onrender.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = `${BACKEND_URL}/api/composio/categories`;
    console.log('Proxying to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward any auth headers if needed
        ...(req.headers.authorization && { authorization: req.headers.authorization }),
      },
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
