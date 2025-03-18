import { MemStorage } from '../server/storage.js';

// Initialize memory storage with test data
const storage = new MemStorage();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - fetch products
  if (req.method === 'GET') {
    try {
      // Parse query parameters
      const { featured, newArrival, bestSeller, categoryId, limit } = req.query;
      
      // Create options object with properly typed parameters
      const options = {
        featured: featured === 'true',
        newArrival: newArrival === 'true',
        bestSeller: bestSeller === 'true',
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        limit: limit ? parseInt(limit) : undefined
      };
      
      // Filter out undefined options
      const filteredOptions = Object.fromEntries(
        Object.entries(options).filter(([_, v]) => v !== undefined)
      );
      
      // Get products
      const products = await storage.getProducts(filteredOptions);
      
      // Return products
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
} 
