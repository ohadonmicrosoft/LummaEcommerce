import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ProductDetail } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useUI } from "@/contexts/UIContext";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import { Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/utils";

interface ProductDetailSectionProps {
  product: ProductDetail;
}

export default function ProductDetailSection({ product }: ProductDetailSectionProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { openCart } = useUI();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colorVariants.length > 0 ? product.colorVariants[0].value : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizeVariants.length > 0 ? product.sizeVariants[0].value : ""
  );
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart({
        productId: product.id,
        quantity,
        colorVariant: selectedColor,
        sizeVariant: selectedSize
      });
      
      setAddedToCart(true);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        variant: "default",
      });
      
      // Open cart after a short delay
      setTimeout(() => {
        openCart();
      }, 300);
      
      // Reset the added state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Calculate if the Add to Cart button should be disabled
  const isAddToCartDisabled = 
    !product.inStock || 
    (product.variants.some(v => v.type === 'color') && !selectedColor) ||
    (product.variants.some(v => v.type === 'size') && !selectedSize);

  const getColorName = (colorValue: string) => {
    const colorVariant = product.colorVariants.find(v => v.value === colorValue);
    return colorVariant ? colorVariant.name : "";
  };

  const getSizeName = (sizeValue: string) => {
    const sizeVariant = product.sizeVariants.find(v => v.value === sizeValue);
    return sizeVariant ? sizeVariant.name : "";
  };

  return (
    <section className="py-20 bg-neutral">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Gallery */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              <ProductImageGallery 
                images={product.images}
                mainImage={product.mainImage}
                productName={product.name}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:w-3/5">
            {/* Breadcrumbs */}
            <nav className="mb-6">
              <ol className="flex text-sm flex-wrap">
                <li className="flex items-center">
                  <Link href="/">
                    <a className="text-secondary hover:text-accent">Home</a>
                  </Link>
                  <i className="fas fa-chevron-right text-xs mx-2 text-secondary"></i>
                </li>
                <li className="flex items-center">
                  <Link href={`/products?category=${product.categoryId}`}>
                    <a className="text-secondary hover:text-accent">
                      {product.categoryId === 1 ? "Tactical Gear" : 
                       product.categoryId === 2 ? "Outdoor Equipment" : 
                       product.categoryId === 3 ? "Tactical Apparel" : "Products"}
                    </a>
                  </Link>
                  <i className="fas fa-chevron-right text-xs mx-2 text-secondary"></i>
                </li>
                <li>
                  <span className="text-primary font-medium">{product.name}</span>
                </li>
              </ol>
            </nav>
            
            {/* Product Title */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-accent font-medium">LUMA TACTICAL</span>
                <span className="inline-block h-4 w-px bg-secondary mx-3"></span>
                <div className="flex items-center text-warning">
                  {[...Array(Math.floor(product.rating))].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                  {product.rating % 1 !== 0 && (
                    <i className="fas fa-star-half-alt"></i>
                  )}
                  {[...Array(Math.floor(5 - product.rating))].map((_, i) => (
                    <i key={i} className="far fa-star"></i>
                  ))}
                  <span className="text-secondary ml-2">({product.reviewCount} reviews)</span>
                </div>
              </div>
              <motion.h1 
                className="font-heading text-4xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {product.name}
              </motion.h1>
            </div>
            
            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-accent">
                  {formatter.format(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span className="ml-3 text-xl text-secondary line-through">
                    {formatter.format(product.price)}
                  </span>
                )}
                <span className="ml-4 px-3 py-1 bg-success/10 text-success text-sm font-semibold rounded">
                  {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>
            </div>
            
            {/* Short Description */}
            <div className="mb-8">
              <p className="text-secondary">{product.description}</p>
            </div>
            
            {/* Variants */}
            <div className="space-y-6 mb-8">
              {/* Color Selection */}
              {product.colorVariants.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Color</h3>
                  <div className="flex space-x-3">
                    {product.colorVariants.map((variant) => (
                      <motion.button 
                        key={variant.id}
                        className={`h-10 w-10 rounded-full focus:outline-none ${
                          selectedColor === variant.value 
                            ? "ring-2 ring-accent ring-offset-2" 
                            : "hover:ring-2 hover:ring-accent hover:ring-offset-2"
                        }`}
                        style={{ backgroundColor: variant.value }}
                        aria-label={variant.name}
                        onClick={() => handleColorChange(variant.value)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size Selection */}
              {product.sizeVariants.length > 0 && (
                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium">Size</h3>
                    <button className="text-accent text-sm hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizeVariants.map((variant) => (
                      <motion.button 
                        key={variant.id}
                        className={`h-10 min-w-[40px] px-3 rounded-md font-medium transition-colors ${
                          selectedSize === variant.value
                            ? "bg-primary text-white border-2 border-primary"
                            : "border-2 border-primary hover:bg-primary hover:text-white"
                        }`}
                        aria-label={`${variant.name} size`}
                        onClick={() => handleSizeChange(variant.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {variant.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Add to Cart */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`p-2 ${quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 text-gray-600 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled || isAddingToCart}
                  className={`flex-1 ${addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white transition-colors`}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Adding...
                    </>
                  ) : addedToCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to Cart
                    </>
                  ) : !product.inStock ? (
                    'Out of Stock'
                  ) : (
                    t('product.addToCart')
                  )}
                </Button>
              </div>
              {isAddToCartDisabled && product.inStock && (
                <p className="text-red-500 text-sm">
                  {!selectedColor && product.variants.some(v => v.type === 'color') ? 'Please select a color.' : ''}
                  {!selectedSize && product.variants.some(v => v.type === 'size') ? 'Please select a size.' : ''}
                </p>
              )}
            </div>
            
            {/* Product Features */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Key Features</h3>
              <ul className="space-y-2">
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <i className="fas fa-check text-success mt-1 mr-3"></i>
                  <span>500D Cordura construction for maximum durability</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <i className="fas fa-check text-success mt-1 mr-3"></i>
                  <span>Quick-release system for emergency situations</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <i className="fas fa-check text-success mt-1 mr-3"></i>
                  <span>MOLLE-compatible webbing for customizable attachments</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <i className="fas fa-check text-success mt-1 mr-3"></i>
                  <span>Adjustable shoulder and side straps for perfect fit</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <i className="fas fa-check text-success mt-1 mr-3"></i>
                  <span>Compatible with standard 10"x12" ballistic plates</span>
                </motion.li>
              </ul>
            </div>
            
            {/* Delivery & Returns */}
            <div className="border-t border-secondary/20 pt-6 mb-8">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <i className="fas fa-shipping-fast text-2xl text-primary mr-3"></i>
                  <div>
                    <h4 className="font-medium text-sm">Free Shipping</h4>
                    <p className="text-secondary text-sm">On orders over $100</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-undo text-2xl text-primary mr-3"></i>
                  <div>
                    <h4 className="font-medium text-sm">Easy Returns</h4>
                    <p className="text-secondary text-sm">30-day money back</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-2xl text-primary mr-3"></i>
                  <div>
                    <h4 className="font-medium text-sm">Warranty</h4>
                    <p className="text-secondary text-sm">2-year limited</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Sharing */}
            <div className="border-t border-secondary/20 pt-6">
              <div className="flex items-center">
                <span className="text-secondary mr-4">Share:</span>
                <div className="flex space-x-2">
                  <motion.a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity" 
                    aria-label="Share on Facebook"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity" 
                    aria-label="Share on Twitter"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fab fa-twitter"></i>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-[#bd081c] text-white flex items-center justify-center hover:opacity-90 transition-opacity" 
                    aria-label="Share on Pinterest"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fab fa-pinterest-p"></i>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity" 
                    aria-label="Share on WhatsApp"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-secondary/20">
            <div className="flex flex-wrap -mb-px">
              <button 
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "description" 
                    ? "border-accent text-accent" 
                    : "border-transparent hover:text-accent"
                } font-medium`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button 
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "specifications" 
                    ? "border-accent text-accent" 
                    : "border-transparent hover:text-accent"
                } font-medium`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
              <button 
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "reviews" 
                    ? "border-accent text-accent" 
                    : "border-transparent hover:text-accent"
                } font-medium`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviewCount})
              </button>
              <button 
                className={`py-4 px-6 border-b-2 ${
                  activeTab === "faq" 
                    ? "border-accent text-accent" 
                    : "border-transparent hover:text-accent"
                } font-medium`}
                onClick={() => setActiveTab("faq")}
              >
                FAQ
              </button>
            </div>
          </div>
          
          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div 
                  key="description"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3 className="font-heading text-2xl font-bold mb-6">Product Description</h3>
                    <div className="space-y-4 text-secondary">
                      <p>The {product.name} represents the pinnacle of modern protective equipment design, engineered for professionals who demand the highest standards of performance and reliability in high-stress environments.</p>
                      
                      <p>Constructed from 500D Cordura fabric, the {product.name} offers exceptional tear and abrasion resistance while maintaining a lightweight profile. The carrier features our proprietary quick-release system, allowing for rapid doffing in emergency situations with a single pull motion.</p>
                      
                      <p>The fully adjustable shoulder and side straps ensure a secure, personalized fit for all body types, while maximizing mobility during dynamic operations. Strategic ventilation channels along the interior help regulate body temperature during extended wear.</p>
                      
                      <p>MOLLE-compatible webbing across the front, back, and sides provides virtually unlimited customization options for pouches and accessories, allowing operators to configure their loadout according to mission-specific requirements.</p>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-lg h-80 lg:h-auto">
                    <img 
                      src="https://images.unsplash.com/photo-1601501581316-8c2920f2e889?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHRhY3RpY2FsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                      alt={`${product.name} in action`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}
              
              {activeTab === "specifications" && (
                <motion.div 
                  key="specifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-2xl font-bold mb-6">Technical Specifications</h3>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Material</p>
                        <p className="font-medium">500D Cordura Nylon</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Weight</p>
                        <p className="font-medium">2.4 lbs (1.1 kg)</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Dimensions</p>
                        <p className="font-medium">12" x 16" x 1" (30cm x 40cm x 2.5cm)</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Compatible Plates</p>
                        <p className="font-medium">Standard 10" x 12" (25cm x 30cm)</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">MOLLE Attachment Points</p>
                        <p className="font-medium">Front, Back, Sides</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Quick-Release System</p>
                        <p className="font-medium">Single-pull front mechanism</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Adjustment Points</p>
                        <p className="font-medium">Shoulders, Sides, Cummerbund</p>
                      </div>
                      <div className="border-b border-neutral-dark/20 pb-3">
                        <p className="text-secondary text-sm">Country of Origin</p>
                        <p className="font-medium">USA</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "reviews" && (
                <motion.div 
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-heading text-2xl font-bold">Customer Reviews</h3>
                    <button className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors">
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="mb-10">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-warning">
                        {[...Array(Math.floor(product.rating))].map((_, i) => (
                          <i key={i} className="fas fa-star text-lg"></i>
                        ))}
                        {product.rating % 1 !== 0 && (
                          <i className="fas fa-star-half-alt text-lg"></i>
                        )}
                        {[...Array(Math.floor(5 - product.rating))].map((_, i) => (
                          <i key={i} className="far fa-star text-lg"></i>
                        ))}
                      </div>
                      <span className="ml-3 font-medium">{product.rating} out of 5</span>
                      <span className="ml-2 text-secondary">({product.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                              <img 
                                src="https://randomuser.me/api/portraits/men/34.jpg" 
                                alt="Michael R." 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">Michael R.</h4>
                              <p className="text-secondary text-sm">Law Enforcement, Colorado</p>
                            </div>
                          </div>
                          <div className="flex items-center text-warning">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                        </div>
                        <h5 className="font-medium mb-2">Top-Tier Equipment</h5>
                        <p className="text-secondary">The Alpha-7 plate carrier has become my go-to for tactical operations. The quality is exceptional, and the attention to detail makes all the difference in the field.</p>
                        <p className="text-xs text-secondary mt-2">Posted on June 15, 2023</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                              <img 
                                src="https://randomuser.me/api/portraits/women/26.jpg" 
                                alt="Sarah K." 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">Sarah K.</h4>
                              <p className="text-secondary text-sm">Professional Guide, Alaska</p>
                            </div>
                          </div>
                          <div className="flex items-center text-warning">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                        </div>
                        <h5 className="font-medium mb-2">Exceeds Expectations</h5>
                        <p className="text-secondary">I've used this in extreme conditions and it's performed flawlessly. The durability is impressive and the comfort level even during long operations is exceptional.</p>
                        <p className="text-xs text-secondary mt-2">Posted on May 29, 2023</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <button className="text-primary hover:text-accent font-medium">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "faq" && (
                <motion.div 
                  key="faq"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="font-heading text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-lg mb-2">Is this product NIJ certified?</h4>
                    <p className="text-secondary">This carrier is designed to hold NIJ certified plates, but the carrier itself is not subject to NIJ certification as it is not ballistic armor.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-lg mb-2">What size plates does this carrier fit?</h4>
                    <p className="text-secondary">The {product.name} is designed to fit standard 10" x 12" (25cm x 30cm) ballistic plates, which is the most common size for civilian and law enforcement use.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-lg mb-2">How do I adjust the fit?</h4>
                    <p className="text-secondary">The carrier features adjustable shoulder straps and side cummerbund. For proper fit, the plate should cover from the suprasternal notch (top of sternum) to approximately 2" above the navel.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-lg mb-2">Is this suitable for hot/humid environments?</h4>
                    <p className="text-secondary">Yes, the {product.name} features ventilation channels designed to help manage heat and moisture. The material is also treated with an antimicrobial coating to reduce odor during extended use.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
