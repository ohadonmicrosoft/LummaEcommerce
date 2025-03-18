import { MemStorage } from '../server/storage.js';

// Initialize memory storage with test data
const storage = new MemStorage();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - fetch all categories
  if (req.method === 'GET' && !req.query.slug) {
    try {
      // Get categories
      const categories = await storage.getCategories();
      
      // Return categories
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ message: 'Failed to fetch categories' });
    }
  }
  
  // GET request - fetch single category by slug
  if (req.method === 'GET' && req.query.slug) {
    try {
      // Get category by slug
      const category = await storage.getCategoryBySlug(req.query.slug);
      
      // Check if category exists
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      // Return category
      return res.status(200).json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      return res.status(500).json({ message: 'Failed to fetch category' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
} 
