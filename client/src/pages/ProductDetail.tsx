import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductDetailSection from '@/components/product/ProductDetailSection';
import { ProductDetail as ProductDetailType } from '@/types';

export default function ProductDetail() {
  // Match route to get product slug
  const params = useParams();
  const slug = params.slug;
  
  // Fetch product details
  const { data: product, error, isLoading } = useQuery<ProductDetailType>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      return response.json();
    },
    enabled: !!slug
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-10"></div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-16 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded mb-10"></div>
                <div className="h-12 bg-gray-200 rounded mb-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load product details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Alert className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Product Not Found</AlertTitle>
          <AlertDescription>
            The product you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProductDetailSection product={product} />
    </motion.div>
  );
}
