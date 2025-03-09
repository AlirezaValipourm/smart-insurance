import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * External API proxy to avoid CORS issues
 * This endpoint forwards requests to the external API
 * 
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  
  if (!path || !Array.isArray(path)) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  
  // // Handle specific endpoints internally first
  // if (path.join('/') === 'getStates') {
  //   return handleGetStates(req, res);
  // }
  
  // For all other endpoints, proxy to external API
  const externalApiUrl = `https://assignment.devotel.io/${path.join('/')}`;
  
  try {
    console.log(`Proxying request to: ${externalApiUrl}`);
    console.log('Request method:', req.method);
    console.log('Request query:', req.query);
    
    // Forward the request to the external API
    const response = await axios({
      method: req.method || 'GET',
      url: externalApiUrl,
      params: req.query,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        // Add any required API keys or authentication headers here
        // 'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });
    
    // Return the response from the external API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    
    // Handle specific API errors
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    // Handle other errors
    return res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
