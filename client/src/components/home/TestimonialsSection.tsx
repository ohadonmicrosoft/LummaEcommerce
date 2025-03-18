import { useState } from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Michael R.",
      role: "Law Enforcement",
      location: "Colorado",
      avatar: "https://randomuser.me/api/portraits/men/34.jpg",
      rating: 5,
      title: "Top-Tier Equipment",
      content: "The Alpha-7 plate carrier has become my go-to for tactical operations. The quality is exceptional, and the attention to detail makes all the difference in the field."
    },
    {
      id: 2,
      name: "Sarah K.",
      role: "Professional Guide",
      location: "Alaska",
      avatar: "https://randomuser.me/api/portraits/women/26.jpg",
      rating: 5,
      title: "Exceeds Expectations",
      content: "The Expedition Ultra Tent has been my shelter through extreme weather conditions across three continents. Worth every penny for serious adventurers."
    },
    {
      id: 3,
      name: "James T.",
      role: "Military Veteran",
      location: "Texas",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      rating: 4.5,
      title: "Battlefield Proven",
      content: "My XTR-5 Tactical Backpack has survived two deployments and still looks almost new. The organization and durability are unmatched in the industry."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-4xl font-bold mb-4 text-gray-800">{t("home.testimonials.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("home.testimonials.subtitle")}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id} 
              className="bg-white rounded-lg p-8 shadow-lg relative"
              variants={item}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-6 left-8">
                <div className="h-12 w-12 rounded-full overflow-hidden border-4 border-white">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center text-warning mb-4 mt-4">
                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                {testimonial.rating % 1 !== 0 && (
                  <i className="fas fa-star-half-alt"></i>
                )}
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 text-gray-800">{testimonial.title}</h3>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div className="font-medium">
                <span className="block text-gray-800">{testimonial.name}</span>
                <span className="text-sm text-gray-500">{testimonial.role}, {testimonial.location}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
