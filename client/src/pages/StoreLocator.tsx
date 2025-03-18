import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, Variants } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fadeIn, staggerContainer, staggerItem } from '@/lib/animations';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoreLocation {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string | null;
  email: string | null;
  storeHours: string | null;
  active: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export default function StoreLocator() {
  const { t, dir } = useLanguage();
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  const { data: stores, isLoading, error } = useQuery({
    queryKey: ['/api/stores'],
    queryFn: () => apiRequest<StoreLocation[]>('/api/stores')
  });
  
  // Reset selected store when changing direction (language)
  useEffect(() => {
    setSelectedStore(null);
  }, [dir]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{t('Error loading stores')}</h2>
          <p>{t('Please try again later')}</p>
        </div>
      </div>
    );
  }

  const activeStores = stores?.filter((store: StoreLocation) => store.active) || [];
  
  // Convert animations to Variants type
  const fadeInVariants: Variants = fadeIn as unknown as Variants;
  const staggerContainerVariants: Variants = staggerContainer as unknown as Variants;
  const staggerItemVariants: Variants = staggerItem as unknown as Variants;
  
  return (
    <motion.div 
      className="container mx-auto py-16 px-4"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('Find a Store')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('Visit one of our stores to experience our products firsthand, get expert advice, or pick up your online orders.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1 space-y-4"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold mb-4">{t('Our Locations')}</h2>
          
          {activeStores.map((store: StoreLocation) => (
            <motion.div 
              key={store.id}
              variants={staggerItemVariants}
              onClick={() => setSelectedStore(store.id)}
              className={`cursor-pointer transition-all duration-300 ${selectedStore === store.id ? 'scale-[1.02]' : ''}`}
            >
              <Card className={`hover:border-primary transition-colors ${selectedStore === store.id ? 'border-primary' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{store.name}</span>
                    {selectedStore === store.id && <MapPin className="h-5 w-5 text-primary" />}
                  </CardTitle>
                  <CardDescription>{store.city}, {store.state}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm">{store.address}</p>
                  <p className="text-sm">{store.city}, {store.state} {store.zipCode}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent"
                    onClick={() => setSelectedStore(store.id)}
                  >
                    {t('View details')} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          variants={fadeInVariants}
        >
          {selectedStore ? (
            <Card className="h-full">
              {activeStores.map((store: StoreLocation) => (
                store.id === selectedStore && (
                  <div key={store.id}>
                    <CardHeader>
                      <CardTitle className="text-2xl">{store.name}</CardTitle>
                      <CardDescription>{t('Store Information')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" /> {t('Address')}
                        </h3>
                        <p>{store.address}</p>
                        <p>{store.city}, {store.state} {store.zipCode}</p>
                        <p>{store.country}</p>
                      </div>

                      {store.phone && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4" /> {t('Phone')}
                          </h3>
                          <p><a href={`tel:${store.phone}`} className="text-primary hover:underline">{store.phone}</a></p>
                        </div>
                      )}

                      {store.email && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <Mail className="h-4 w-4" /> {t('Email')}
                          </h3>
                          <p><a href={`mailto:${store.email}`} className="text-primary hover:underline">{store.email}</a></p>
                        </div>
                      )}

                      {store.storeHours && (
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4" /> {t('Store Hours')}
                          </h3>
                          <p>{store.storeHours}</p>
                        </div>
                      )}

                      {store.latitude && store.longitude && (
                        <div className="pt-4">
                          <Button className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            <a 
                              href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {t('Get Directions')}
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </div>
                )
              ))}
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-dashed rounded-lg p-8 text-center space-y-4">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-xl font-medium">{t('Select a store')}</h3>
              <p className="text-muted-foreground">{t('Click on any store from the list to view its details')}</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('Inventory Availability')}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          {t('Check real-time inventory availability for products across all our stores')}
        </p>
        <Link href="/products">
          <Button size="lg" className="font-medium">
            {t('Browse Products')}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}