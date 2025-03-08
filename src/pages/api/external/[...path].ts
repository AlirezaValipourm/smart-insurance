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

// /**
//  * Handle getStates endpoint
//  * @param req - Next.js API request
//  * @param res - Next.js API response
//  */
// async function handleGetStates(req: NextApiRequest, res: NextApiResponse) {
//   const { dependentValue } = req.query;
  
//   if (!dependentValue || typeof dependentValue !== 'string') {
//     return res.status(400).json({ error: 'Country is required' });
//   }
  
//   console.log(`API: Fetching states for country: ${dependentValue}`);
  
//   try {
//     const states = getStatesByCountry(dependentValue);
    
//     // Add a small delay to simulate network latency
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     return res.status(200).json(states);
//   } catch (error) {
//     console.error('Error fetching states:', error);
//     return res.status(500).json({ error: 'Failed to fetch states' });
//   }
// }

// /**
//  * Get states by country
//  * @param country - The country to get states for
//  * @returns Array of states
//  */
// function getStatesByCountry(country: string): string[] {
//   switch (country) {
//     case 'USA':
//       return [
//         'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
//         'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
//         'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//         'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
//         'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
//         'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
//         'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
//         'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
//         'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//         'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
//       ];
//     case 'Canada':
//       return [
//         'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
//         'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
//         'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 
//         'Saskatchewan', 'Yukon'
//       ];
//     case 'Germany':
//       return [
//         'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 
//         'Bremen', 'Hamburg', 'Hesse', 'Lower Saxony', 
//         'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
//         'Rhineland-Palatinate', 'Saarland', 'Saxony',
//         'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
//       ];
//     case 'France':
//       return [
//         'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 
//         'Centre-Val de Loire', 'Corsica', 'Grand Est', 
//         'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine',
//         'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
//       ];
//     default:
//       return [];
//   }
// } 