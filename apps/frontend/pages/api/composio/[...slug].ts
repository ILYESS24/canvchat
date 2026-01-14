import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'https://suna-backend.onrender.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { slug } = req.query;
    const path = Array.isArray(slug) ? slug.join('/') : slug || '';

    // Build the backend URL
    const backendUrl = `${BACKEND_URL}/api/composio/${path}`;
    console.log('Proxying to:', backendUrl, 'Method:', req.method);

    // Handle query parameters
    const url = new URL(backendUrl);
    Object.keys(req.query).forEach(key => {
      if (key !== 'slug') {
        url.searchParams.append(key, req.query[key] as string);
      }
    });

    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { authorization: req.headers.authorization }),
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && {
        body: JSON.stringify(req.body)
      }),
    });

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

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

