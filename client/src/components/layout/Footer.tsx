import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">LUMA</h3>
            <p className="text-neutral-dark mb-6">
              {t("footer.aboutDesc")}
            </p>
            <div className="flex rtl:space-x-reverse space-x-4">
              <a href="#" className="text-neutral hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral hover:text-accent transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold mb-6">{t("nav.shop")}</h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=tactical-gear"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Tactical Gear</span></Link></li>
              <li><Link href="/products?category=outdoor-equipment"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Outdoor Equipment</span></Link></li>
              <li><Link href="/products?category=apparel"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Apparel</span></Link></li>
              <li><Link href="/products?newArrival=true"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">New Arrivals</span></Link></li>
              <li><Link href="/products?sale=true"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Sale Items</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.help")}</h4>
            <ul className="space-y-3">
              <li><Link href="/contact"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">{t("footer.contact")}</span></Link></li>
              <li><Link href="/faq"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">FAQs</span></Link></li>
              <li><Link href="/shipping"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Shipping & Returns</span></Link></li>
              <li><Link href="/size-guides"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Size Guides</span></Link></li>
              <li><Link href="/product-care"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Product Care</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold mb-6">{t("footer.about")}</h4>
            <ul className="space-y-3">
              <li><Link href="/about"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/our-stories"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Our Stories</span></Link></li>
              <li><Link href="/sustainability"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Sustainability</span></Link></li>
              <li><Link href="/careers"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Careers</span></Link></li>
              <li><Link href="/discounts"><span className="text-neutral-dark hover:text-accent transition-colors cursor-pointer">Military & Service Discounts</span></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-light pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-dark mb-4 md:mb-0">&copy; {new Date().getFullYear()} Luma Tactical & Outdoor. {t("footer.rights")}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy"><span className="text-neutral-dark hover:text-accent transition-colors text-sm cursor-pointer">Privacy Policy</span></Link>
              <Link href="/terms"><span className="text-neutral-dark hover:text-accent transition-colors text-sm cursor-pointer">Terms of Service</span></Link>
              <Link href="/cookies"><span className="text-neutral-dark hover:text-accent transition-colors text-sm cursor-pointer">Cookie Policy</span></Link>
              <Link href="/accessibility"><span className="text-neutral-dark hover:text-accent transition-colors text-sm cursor-pointer">Accessibility</span></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
