import { motion } from "framer-motion";

export default function FeaturesSection() {
  const features = [
    {
      icon: "fas fa-shield-alt",
      title: "Military-Grade Quality",
      description: "Our products meet or exceed military specifications for durability and performance."
    },
    {
      icon: "fas fa-flask",
      title: "Advanced Materials",
      description: "We utilize cutting-edge fabrics and components that push the boundaries of what's possible."
    },
    {
      icon: "fas fa-users",
      title: "Field Tested",
      description: "Every product is rigorously tested by professionals in real-world tactical and outdoor scenarios."
    },
    {
      icon: "fas fa-truck",
      title: "Lifetime Support",
      description: "We stand behind our products with exceptional customer service and technical support."
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
    <section className="py-20 bg-slate-50 text-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-4xl font-bold mb-5 tracking-tight">Why Choose Luma</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
            We combine cutting-edge materials with expert craftsmanship to deliver tactical and outdoor equipment that performs when it matters most.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              variants={item}
            >
              <motion.div 
                className="inline-flex h-20 w-20 rounded-full bg-sky-200 items-center justify-center mb-6"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(186, 230, 253, 0.8)" 
                }}
                transition={{ duration: 0.3 }}
              >
                <i className={`${feature.icon} text-3xl text-gray-800`}></i>
              </motion.div>
              <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
