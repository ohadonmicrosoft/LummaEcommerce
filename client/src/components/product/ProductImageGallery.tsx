import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ProductImage } from "@/types";
import { ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageGalleryProps {
  images: ProductImage[];
  mainImage: string;
  productName: string;
}

export default function ProductImageGallery({ 
  images, 
  mainImage: initialMainImage, 
  productName 
}: ProductImageGalleryProps) {
  const [mainImage, setMainImage] = useState(
    images.length > 0 
      ? images[0].imageUrl 
      : initialMainImage
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For pan and pinch gestures
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  
  // Update the main image when the initialMainImage changes
  useEffect(() => {
    if (initialMainImage && initialMainImage !== mainImage) {
      setMainImage(initialMainImage);
      const newIndex = images.findIndex(img => img.imageUrl === initialMainImage);
      if (newIndex >= 0) {
        setActiveImageIndex(newIndex);
      }
    }
  }, [initialMainImage, images, mainImage]);

  // Escape key handler for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        setIsZoomed(false);
        setZoomLevel(1);
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const resetZoom = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    setZoomPosition({ x: 0, y: 0 });
  };

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setActiveImageIndex(index);
    
    // Reset zoom when changing images
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
      resetZoom();
    }
  };

  const handleZoomToggle = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
      resetZoom();
    } else {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  };

  const handleZoomInOut = (delta: number) => {
    const newLevel = Math.max(1, Math.min(4, zoomLevel + delta));
    setZoomLevel(newLevel);
    
    if (newLevel === 1) {
      setIsZoomed(false);
      resetZoom();
    } else {
      setIsZoomed(true);
      scale.set(newLevel);
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isDragging) return;
    
    const bounds = e.currentTarget.getBoundingClientRect();
    
    // Calculate normalized position (0-1) within the image
    const xNorm = (e.clientX - bounds.left) / bounds.width;
    const yNorm = (e.clientY - bounds.top) / bounds.height;
    
    // Calculate how much the image overflows the container when zoomed
    const overflowX = bounds.width * (zoomLevel - 1);
    const overflowY = bounds.height * (zoomLevel - 1);
    
    // Calculate position (scaled to overflow amount)
    const xPos = -overflowX * xNorm;
    const yPos = -overflowY * yNorm;
    
    // Update position
    x.set(xPos);
    y.set(yPos);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    if (isFullscreen) {
      // Reset zoom when exiting fullscreen
      setIsZoomed(false);
      setZoomLevel(1);
      resetZoom();
    }
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (activeImageIndex + 1) % images.length;
    } else {
      newIndex = (activeImageIndex - 1 + images.length) % images.length;
    }
    
    setMainImage(images[newIndex].imageUrl);
    setActiveImageIndex(newIndex);
    
    // Reset zoom when changing images
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
      resetZoom();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isFullscreen || isZoomed) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.5 : 0.5;
      handleZoomInOut(delta);
    }
  };

  const handleDragStart = () => {
    if (zoomLevel > 1) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Determine if we should show fullscreen galleries based on screen size
  const shouldHaveFullscreen = images.length > 0;

  return (
    <>
      {/* Main Image Gallery */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
        {/* Main Image Container */}
        <div 
          ref={containerRef}
          className={`relative overflow-hidden rounded-lg ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'} mb-4`}
          style={{ height: isFullscreen ? 'auto' : '400px' }}
          onClick={isFullscreen ? undefined : handleZoomToggle}
          onWheel={handleWheel}
        >
          <motion.div 
            className="w-full h-full"
            style={{ 
              x,
              y,
              scale,
              cursor: isZoomed ? 'move' : 'zoom-in',
            }}
            drag={isZoomed}
            dragConstraints={containerRef}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseMove={handleImageMouseMove}
          >
            <motion.img 
              src={mainImage} 
              alt={productName} 
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Control Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <motion.button 
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-colors" 
              aria-label={isZoomed ? "Zoom Out" : "Zoom In"}
              onClick={(e) => {
                e.stopPropagation();
                handleZoomToggle();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </motion.button>
            
            {shouldHaveFullscreen && (
              <motion.button 
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-colors" 
                aria-label="Fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreenToggle();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Maximize2 className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <motion.button 
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Previous Image"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Next Image"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </>
          )}

          {/* Zoom level indicator */}
          {isZoomed && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="product-gallery-nav grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className={`relative rounded-md cursor-pointer h-16 overflow-hidden ${
                  activeImageIndex === index 
                    ? "ring-2 ring-accent" 
                    : "hover:ring-1 hover:ring-accent"
                }`}
                onClick={() => handleThumbnailClick(image.imageUrl, index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={image.imageUrl} 
                  alt={image.altText || `${productName} - View ${index + 1}`} 
                  className="h-full w-full object-cover"
                />
                {activeImageIndex === index && (
                  <motion.div 
                    className="absolute inset-0 bg-accent/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-accent"
              onClick={handleFullscreenToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <motion.button 
                className="text-white bg-black/50 p-2 rounded-full hover:bg-accent"
                onClick={() => handleZoomInOut(-0.5)}
                disabled={zoomLevel <= 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomOut className="h-6 w-6" />
              </motion.button>
              <motion.button 
                className="text-white bg-black/50 p-2 rounded-full hover:bg-accent"
                onClick={() => handleZoomInOut(0.5)}
                disabled={zoomLevel >= 4}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomIn className="h-6 w-6" />
              </motion.button>
            </div>
            
            {/* Main Fullscreen Image */}
            <div 
              ref={containerRef}
              className="relative w-full h-full max-h-[80vh] flex items-center justify-center overflow-hidden"
              onWheel={handleWheel}
            >
              <motion.div
                style={{ 
                  x,
                  y,
                  scale,
                  cursor: isZoomed ? 'move' : 'zoom-in',
                }}
                drag={isZoomed}
                dragConstraints={containerRef}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseMove={handleImageMouseMove}
                className="relative w-full h-full flex items-center justify-center"
              >
                <motion.img
                  src={mainImage}
                  alt={productName}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </motion.div>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-accent"
                    onClick={() => navigateImage('prev')}
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>
                  <motion.button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-accent"
                    onClick={() => navigateImage('next')}
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </>
              )}
            </div>
            
            {/* Fullscreen Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className={`h-16 w-16 rounded-md cursor-pointer overflow-hidden ${
                      activeImageIndex === index 
                        ? "ring-2 ring-accent" 
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => handleThumbnailClick(image.imageUrl, index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={image.imageUrl} 
                      alt={image.altText || `${productName} - View ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Zoom level indicator */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}