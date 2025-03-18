import { Language } from "@/contexts/LanguageContext";

// Translations database
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.search": "Search",
    "nav.cart": "Cart",
    "nav.account": "Account",
    "nav.switchLanguage": "Switch language",
    
    // Accessibility Menu
    "accessibility.menu.toggle": "Toggle accessibility options",
    "accessibility.menu.title": "Accessibility Options",
    "accessibility.menu.description": "Customize your browsing experience with these accessibility settings.",
    "accessibility.menu.close": "Close accessibility menu",
    "accessibility.menu.footer": "These settings are saved automatically and will be remembered on your next visit.",
    
    "accessibility.mode.standard": "Standard Mode",
    "accessibility.mode.standard.description": "Default website experience with all visual features enabled.",
    
    "accessibility.mode.screenReader": "Screen Reader Mode",
    "accessibility.mode.screenReader.description": "Optimized for screen readers with enhanced descriptions and navigation assistance.",
    
    "accessibility.mode.highContrast": "High Contrast Mode",
    "accessibility.mode.highContrast.description": "Improved text and color contrast for better visibility.",
    
    "accessibility.mode.reducedMotion": "Reduced Motion",
    "accessibility.mode.reducedMotion.description": "Minimizes animations and motion effects for a distraction-free experience.",
    
    // Home Page
    "home.hero.title": "Tactical Gear for Modern Adventures",
    "home.hero.subtitle": "Professional equipment for outdoor enthusiasts and tactical professionals",
    "home.hero.cta": "Shop Now",
    "home.hero.secondaryCta": "Our Story",
    "home.hero.scrollText": "Scroll to explore",
    "home.featured.title": "Featured Products",
    "home.featured.description": "Our most popular tactical and outdoor gear, selected for exceptional quality and performance.",
    "home.featured.viewAll": "View All Products",
    "home.categories.title": "Explore Categories",
    "home.categories.description": "Discover our premium collection of tactical gear and outdoor equipment designed for peak performance.",
    "home.testimonials.title": "What Our Customers Say",
    "home.testimonials.subtitle": "Hear from professionals who trust Luma gear when it matters most",
    "home.features.title": "Why Choose Luma",
    "home.features.shipping.title": "Free Shipping",
    "home.features.shipping.desc": "On all orders over $100",
    "home.features.support.title": "24/7 Support",
    "home.features.support.desc": "Get help when you need it",
    "home.features.returns.title": "Easy Returns",
    "home.features.returns.desc": "30-day return policy",
    "home.features.secure.title": "Secure Checkout",
    "home.features.secure.desc": "Your data is protected",
    "home.newsletter.title": "Subscribe to Our Newsletter",
    "home.newsletter.subtitle": "Get the latest updates on new products and special sales",
    "home.newsletter.placeholder": "Your email address",
    "home.newsletter.button": "Subscribe",
    "home.newsletter.privacy": "By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.",
    
    // Product Details
    "product.addToCart": "Add to Cart",
    "product.outOfStock": "Out of Stock",
    "product.description": "Description",
    "product.features": "Features",
    "product.specifications": "Specifications",
    "product.reviews": "Reviews",
    "product.related": "You may also like",
    "product.color": "Color",
    "product.size": "Size",
    "product.quantity": "Quantity",
    
    // Cart
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.continue": "Continue Shopping",
    "cart.checkout": "Checkout",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.tax": "Tax",
    "cart.total": "Total",
    "cart.remove": "Remove",
    
    // Footer
    "footer.about": "About Luma",
    "footer.aboutDesc": "Luma is a premium tactical gear provider for outdoor enthusiasts and professionals.",
    "footer.categories": "Categories",
    "footer.help": "Help",
    "footer.contact": "Contact",
    "footer.social": "Follow Us",
    "footer.newsletter": "Newsletter",
    "footer.rights": "All rights reserved",
    
    // Products Page
    "products.allProducts": "All Products",
    "products.filters": "Filters",
    "products.clearAll": "Clear All",
    "products.clearFilters": "Clear Filters",
    "products.sortBy": "Sort By",
    "products.sortNewest": "Newest First",
    "products.sortPriceLow": "Price: Low to High",
    "products.sortPriceHigh": "Price: High to Low",
    "products.sortPopular": "Most Popular",
    "products.showing": "Showing",
    "products.results": "results",
    "products.noProducts": "No Products Found",
    "products.noProductsDesc": "Try adjusting your filters or browse all products",
    "products.categories": "Categories",
    "products.features": "Features",
    "products.featured": "Featured Products",
    "products.newArrivals": "New Arrivals",
    "products.bestSellers": "Best Sellers",
    "products.inStock": "In Stock Only",
    "products.priceRange": "Price Range",

    // Error Messages
    "errors.failedToLoadProducts": "Failed to load products. Please try again later.",
    "errors.failedToLoadCategories": "Failed to load categories. Please try again later.",
  },
  he: {
    // Navigation
    "nav.home": "דף הבית",
    "nav.shop": "חנות",
    "nav.categories": "קטגוריות",
    "nav.about": "אודות",
    "nav.contact": "צור קשר",
    "nav.search": "חיפוש",
    "nav.cart": "עגלה",
    "nav.account": "חשבון",
    "nav.switchLanguage": "החלף שפה",
    
    // Accessibility Menu
    "accessibility.menu.toggle": "הצג אפשרויות נגישות",
    "accessibility.menu.title": "אפשרויות נגישות",
    "accessibility.menu.description": "התאם את חווית הגלישה שלך עם הגדרות הנגישות הבאות.",
    "accessibility.menu.close": "סגור תפריט נגישות",
    "accessibility.menu.footer": "הגדרות אלו נשמרות אוטומטית ויזכרו בביקור הבא שלך.",
    
    "accessibility.mode.standard": "מצב רגיל",
    "accessibility.mode.standard.description": "חווית אתר ברירת מחדל עם כל התכונות החזותיות מופעלות.",
    
    "accessibility.mode.screenReader": "מצב קורא מסך",
    "accessibility.mode.screenReader.description": "מותאם לקוראי מסך עם תיאורים מורחבים וסיוע בניווט.",
    
    "accessibility.mode.highContrast": "מצב ניגודיות גבוהה",
    "accessibility.mode.highContrast.description": "שיפור ניגודיות טקסט וצבע לראות טובה יותר.",
    
    "accessibility.mode.reducedMotion": "הפחתת תנועה",
    "accessibility.mode.reducedMotion.description": "ממזער אנימציות ואפקטים של תנועה לחוויה ללא הסחות דעת.",
    
    // Home Page
    "home.hero.title": "ציוד טקטי להרפתקאות מודרניות",
    "home.hero.subtitle": "ציוד מקצועי לחובבי טיולים ואנשי מקצוע טקטיים",
    "home.hero.cta": "קנה עכשיו",
    "home.hero.secondaryCta": "הסיפור שלנו",
    "home.hero.scrollText": "גלול לגלות",
    "home.featured.title": "מוצרים מובחרים",
    "home.featured.description": "ציוד טקטי ולשטח הפופולרי ביותר שלנו, שנבחר בקפידה לאיכות וביצועים יוצאי דופן.",
    "home.featured.viewAll": "הצג את כל המוצרים",
    "home.categories.title": "גלה קטגוריות",
    "home.categories.description": "גלה את אוסף הציוד הטקטי והחוץ פרימיום שלנו המעוצב לביצועים מיטביים.",
    "home.testimonials.title": "מה אומרים לקוחותינו",
    "home.testimonials.subtitle": "שמע מאנשי מקצוע שסומכים על ציוד לומה ברגעים החשובים ביותר",
    "home.features.title": "למה לבחור בלומה",
    "home.features.shipping.title": "משלוח חינם",
    "home.features.shipping.desc": "בהזמנות מעל ₪350",
    "home.features.support.title": "תמיכה 24/7",
    "home.features.support.desc": "קבל עזרה כשאתה צריך אותה",
    "home.features.returns.title": "החזרות קלות",
    "home.features.returns.desc": "מדיניות החזרה של 30 יום",
    "home.features.secure.title": "קופה מאובטחת",
    "home.features.secure.desc": "הנתונים שלך מוגנים",
    "home.newsletter.title": "הירשם לניוזלטר שלנו",
    "home.newsletter.subtitle": "קבל עדכונים על מוצרים חדשים ומבצעים מיוחדים",
    "home.newsletter.placeholder": "כתובת האימייל שלך",
    "home.newsletter.button": "הרשמה",
    "home.newsletter.privacy": "בהרשמה, אתה מסכים למדיניות הפרטיות שלנו ומסכים לקבל עדכונים מהחברה שלנו.",
    
    // Product Details
    "product.addToCart": "הוסף לעגלה",
    "product.outOfStock": "אזל מהמלאי",
    "product.description": "תיאור",
    "product.features": "תכונות",
    "product.specifications": "מפרט טכני",
    "product.reviews": "ביקורות",
    "product.related": "אולי תאהב גם",
    "product.color": "צבע",
    "product.size": "גודל",
    "product.quantity": "כמות",
    
    // Cart
    "cart.title": "העגלה שלך",
    "cart.empty": "העגלה שלך ריקה",
    "cart.continue": "המשך בקניות",
    "cart.checkout": "לקופה",
    "cart.subtotal": "סיכום ביניים",
    "cart.shipping": "משלוח",
    "cart.tax": "מע\"מ",
    "cart.total": "סה\"כ",
    "cart.remove": "הסר",
    
    // Footer
    "footer.about": "אודות לומה",
    "footer.aboutDesc": "לומה היא ספקית ציוד טקטי פרימיום לחובבי טבע ואנשי מקצוע.",
    "footer.categories": "קטגוריות",
    "footer.help": "עזרה",
    "footer.contact": "צור קשר",
    "footer.social": "עקבו אחרינו",
    "footer.newsletter": "ניוזלטר",
    "footer.rights": "כל הזכויות שמורות",
    
    // Products Page
    "products.allProducts": "כל המוצרים",
    "products.filters": "סינון",
    "products.clearAll": "נקה הכל",
    "products.clearFilters": "נקה סינון",
    "products.sortBy": "מיין לפי",
    "products.sortNewest": "החדש ביותר",
    "products.sortPriceLow": "מחיר: מהנמוך לגבוה",
    "products.sortPriceHigh": "מחיר: מהגבוה לנמוך",
    "products.sortPopular": "הכי פופולרי",
    "products.showing": "מציג",
    "products.results": "תוצאות",
    "products.noProducts": "לא נמצאו מוצרים",
    "products.noProductsDesc": "נסה להתאים את הסינון שלך או עיין בכל המוצרים",
    "products.categories": "קטגוריות",
    "products.features": "תכונות",
    "products.featured": "מוצרים מובחרים",
    "products.newArrivals": "חדש במלאי",
    "products.bestSellers": "הנמכרים ביותר",
    "products.inStock": "במלאי בלבד",
    "products.priceRange": "טווח מחירים",

    // Error Messages
    "errors.failedToLoadProducts": "טעינת המוצרים נכשלה. אנא נסה שוב מאוחר יותר.",
    "errors.failedToLoadCategories": "טעינת הקטגוריות נכשלה. אנא נסה שוב מאוחר יותר.",
  }
};

/**
 * Get a translation string for the given key
 * @param key Translation key
 * @param language Current language
 * @returns Translated string or key if not found
 */
export function getTranslation(key: string, language: Language): string {
  try {
    // Extensive debugging
    console.log(`🔍 TRANSLATION LOOKUP - key: "${key}" in language: "${language}"`);
    
    // Make sure we have translations for this language
    if (!translations[language]) {
      console.error(`❌ No translations available for language: ${language}`);
      return key;
    }
    
    // Access the translations object
    console.log(`📖 Available languages:`, Object.keys(translations));
    
    // Verify the translation object structure
    const translationObj = translations[language];
    console.log(`📖 Type of translations[${language}]:`, typeof translationObj);
    
    // See if we have the key
    const hasKey = Object.prototype.hasOwnProperty.call(translationObj, key);
    console.log(`🔑 translations[${language}] has key "${key}": ${hasKey}`);
    
    // Get the value directly
    const directTranslation = translationObj[key];
    console.log(`📝 Value for key "${key}": "${directTranslation}"`);
    
    // If translation is missing, fallback to English or key
    if (directTranslation === undefined) {
      console.warn(`⚠️ Missing translation for key: "${key}" in language: "${language}"`);
      
      // Check if we have the translation in English as a fallback
      if (language !== 'en' && translations['en']) {
        const hasEnglishKey = Object.prototype.hasOwnProperty.call(translations['en'], key);
        console.log(`🔍 Fallback: translations['en'] has key "${key}": ${hasEnglishKey}`);
        
        if (hasEnglishKey && translations['en'][key]) {
          console.log(`✅ Using English fallback: "${translations['en'][key]}"`);
          return translations['en'][key];
        }
      }
      
      console.warn(`⚠️ No translation found for key: "${key}" - returning key as fallback`);
      return key; // Return the key as last fallback
    }
    
    console.log(`✅ Returning translation: "${directTranslation}"`);
    return directTranslation;
  } catch (error) {
    console.error(`❌ Error getting translation for key: "${key}"`, error);
    return key;
  }
}

export default translations;