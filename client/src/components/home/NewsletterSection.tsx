import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600/70 to-slate-800/90 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553304390-83c2e7b9ce2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="font-heading text-3xl md:text-5xl font-bold mb-5 tracking-tight text-white drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("home.newsletter.title")}
          </motion.h2>
          <motion.p 
            className="text-white/95 mb-10 text-lg font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("home.newsletter.subtitle")}
          </motion.p>
          
          <motion.form 
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div className="relative flex-1"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input 
                type="email" 
                placeholder={t("home.newsletter.placeholder")}
                className="flex-1 w-full px-5 py-4 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg border border-white/20 backdrop-blur-sm bg-white/95" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            <motion.button 
              type="submit" 
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg border border-white/10"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                t("home.newsletter.button")
              )}
            </motion.button>
          </motion.form>
          
          <motion.p 
            className="text-white/70 text-sm mt-6 max-w-lg mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t("home.newsletter.privacy") || "By subscribing, you agree to our Privacy Policy and consent to receive updates from our company."}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
