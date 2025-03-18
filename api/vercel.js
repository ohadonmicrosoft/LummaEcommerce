import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

export default async (req, res) => {
  // This file is used to allow the Express app to work in Vercel's serverless environment
  // by handling incoming requests and forwarding them to the Express app
  
  // Import the Express app
  const app = (await import('./index.js')).default;
  
  // Forward the request to Express
  return new Promise((resolve, reject) => {
    // Create a fake HTTP server context to pass to Express
    const server = createServer((_, __) => {});
    
    app(req, res);
    
    // Since we're handling the request directly with Express, 
    // we don't need to wait for a response event
    res.on('finish', resolve);
    res.on('error', reject);
  });
}; 
