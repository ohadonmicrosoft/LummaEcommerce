import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";

type SortOption = "newest" | "price-low" | "price-high" | "popular";

export default function Products() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  
  // Parse URL query parameters
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  
  // State for filters and sorting
  const [categoryFilter, setCategoryFilter] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);
  const [filterSelections, setFilterSelections] = useState({
    featured: false,
    newArrival: false,
    bestSeller: false,
    inStock: false,
    priceRange: [0, 500] as [number, number],
  });
  
  // Queries
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Construct query key based on filters
  const queryParams: string[] = ['/api/products'];
  const urlParams = new URLSearchParams();
  
  if (categoryFilter) {
    const category = categories?.find(c => c.slug === categoryFilter);
    if (category) {
      queryParams.push(`categoryId=${category.id}`);
      urlParams.set("category", categoryFilter);
    }
  }
  
  if (filterSelections.featured) {
    queryParams.push("featured=true");
    urlParams.set("featured", "true");
  }
  
  if (filterSelections.newArrival) {
    queryParams.push("newArrival=true");
    urlParams.set("newArrival", "true");
  }
  
  if (filterSelections.bestSeller) {
    queryParams.push("bestSeller=true");
    urlParams.set("bestSeller", "true");
  }
  
  const queryKey = queryParams.join('&');
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [queryKey],
  });
  
  // Update URL when filters change
  useEffect(() => {
    // Don't update URL on initial load if there are no filters
    if (Object.values(filterSelections).every(val => 
      Array.isArray(val) ? val[0] === 0 && val[1] === 500 : val === false) && 
      !categoryFilter) {
      return;
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [filterSelections, categoryFilter]);
  
  // Sort products based on selected sort option
  const sortedProducts = products ? [...products].sort((a, b) => {
    switch(sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "price-low":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-high":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "popular":
        return b.rating - a.rating;
      default:
        return 0;
    }
  }) : [];
  
  // Filter products based on price range
  const filteredProducts = sortedProducts.filter(product => {
    const price = product.salePrice || product.price;
    return price >= filterSelections.priceRange[0] && price <= filterSelections.priceRange[1];
  });
  
  // Filter products based on in-stock status if selected
  const finalProducts = filterSelections.inStock 
    ? filteredProducts.filter(product => product.inStock) 
    : filteredProducts;
  
  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filterSelections, value: any) => {
    setFilterSelections(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle category filter change
  const handleCategoryChange = (slug: string | null) => {
    setCategoryFilter(slug);
    
    // Update URL
    if (!slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    setLocation(newUrl);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilterSelections({
      featured: false,
      newArrival: false,
      bestSeller: false,
      inStock: false,
      priceRange: [0, 500] as [number, number],
    });
    setCategoryFilter(null);
    setLocation('/products');
  };
  
  // Get active category name
  const activeCategoryName = categories?.find(c => c.slug === categoryFilter)?.name || t("products.allProducts");
  
  // Loading state
  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-50 min-h-screen">
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={fadeIn as any}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{activeCategoryName}</h1>
          <div className="flex items-center text-muted-foreground text-sm">
            <span>{t("nav.home")}</span>
            <span className="mx-2">/</span>
            <span>{t("nav.shop")}</span>
            {categoryFilter && (
              <>
                <span className="mx-2">/</span>
                <span>{activeCategoryName}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filters */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t("products.filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{t("products.filters")}</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  {renderFilters()}
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Desktop Filters */}
          {!isMobile && (
            <div className="w-64 shrink-0">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {t("products.filters")}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground"
                    onClick={clearFilters}
                  >
                    {t("products.clearAll")}
                  </Button>
                </div>
                {renderFilters()}
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-border">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-muted-foreground">
                  {t("products.showing")} <span className="font-medium text-foreground">{finalProducts.length}</span> {t("products.results")}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val as SortOption)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={t("products.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("products.sortNewest")}</SelectItem>
                    <SelectItem value="price-low">{t("products.sortPriceLow")}</SelectItem>
                    <SelectItem value="price-high">{t("products.sortPriceHigh")}</SelectItem>
                    <SelectItem value="popular">{t("products.sortPopular")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Product Grid */}
            {finalProducts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={staggerContainer as any}
                initial="hidden"
                animate="show"
              >
                {finalProducts.map((product) => (
                  <motion.div key={product.id} variants={staggerItem as any}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-border">
                <h3 className="text-xl font-semibold mb-2">{t("products.noProducts")}</h3>
                <p className="text-muted-foreground mb-6">{t("products.noProductsDesc")}</p>
                <Button onClick={clearFilters}>{t("products.clearFilters")}</Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
  
  // Render filters function
  function renderFilters() {
    return (
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h4 className="font-medium mb-3">{t("products.categories")}</h4>
          <div className="space-y-2">
            <div 
              className={`flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-neutral-100 ${!categoryFilter ? 'bg-primary/10 text-primary font-medium' : ''}`}
              onClick={() => handleCategoryChange(null)}
            >
              <span>{t("products.allProducts")}</span>
              {!categoryFilter && <Check className="h-4 w-4" />}
            </div>
            {categories?.map((category) => (
              <div 
                key={category.id}
                className={`flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-neutral-100 ${categoryFilter === category.slug ? 'bg-primary/10 text-primary font-medium' : ''}`}
                onClick={() => handleCategoryChange(category.slug)}
              >
                <span>{category.name}</span>
                {categoryFilter === category.slug && <Check className="h-4 w-4" />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Features */}
        <div>
          <h4 className="font-medium mb-3">{t("products.features")}</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={filterSelections.featured}
                onCheckedChange={(checked) => 
                  handleFilterChange('featured', checked === true)
                }
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("products.featured")}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="newArrival" 
                checked={filterSelections.newArrival}
                onCheckedChange={(checked) => 
                  handleFilterChange('newArrival', checked === true)
                }
              />
              <label
                htmlFor="newArrival"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("products.newArrivals")}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bestSeller" 
                checked={filterSelections.bestSeller}
                onCheckedChange={(checked) => 
                  handleFilterChange('bestSeller', checked === true)
                }
              />
              <label
                htmlFor="bestSeller"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("products.bestSellers")}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inStock" 
                checked={filterSelections.inStock}
                onCheckedChange={(checked) => 
                  handleFilterChange('inStock', checked === true)
                }
              />
              <label
                htmlFor="inStock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("products.inStock")}
              </label>
            </div>
          </div>
        </div>
        
        {/* Price Range - We would ideally use a slider here */}
        <div>
          <h4 className="font-medium mb-3">{t("products.priceRange")}</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input 
                type="number" 
                value={filterSelections.priceRange[0]}
                onChange={(e) => handleFilterChange('priceRange', [
                  Number(e.target.value), 
                  filterSelections.priceRange[1]
                ])}
                className="w-full px-7 py-2 border rounded-md"
                min="0"
                max={filterSelections.priceRange[1]}
              />
            </div>
            <span>-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input 
                type="number" 
                value={filterSelections.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [
                  filterSelections.priceRange[0], 
                  Number(e.target.value)
                ])}
                className="w-full px-7 py-2 border rounded-md"
                min={filterSelections.priceRange[0]}
              />
            </div>
          </div>
        </div>
        
        {/* Clear Filters Button (Mobile) */}
        {isMobile && (
          <Button 
            onClick={clearFilters}
            className="w-full mt-4"
          >
            {t("products.clearFilters")}
          </Button>
        )}
      </div>
    );
  }
}