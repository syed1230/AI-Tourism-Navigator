import React from "react";
import { motion } from "framer-motion";
import { Leaf, Heart, Globe, Shield } from "lucide-react";

export default function About() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/temple-ruins.png" 
            alt="Jharkhand Heritage" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Our Mission
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We built EcoJharkhand to digitize the unexplored while fiercely protecting it. 
              Tourism shouldn't destroy what it seeks to admire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 relative z-20">
        <div className="container px-4 md:px-6 max-w-5xl">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={item} className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Leave No Trace</h3>
              <p className="text-muted-foreground leading-relaxed">
                Jharkhand's forests are ancient and fragile. We promote zero-waste travel, highlight eco-friendly transport, and actively reward users who pick up trash on trails. Nature is not a playground; it's a sanctuary.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Tribal First</h3>
              <p className="text-muted-foreground leading-relaxed">
                The indigenous communities are the true guardians of this land. We center their stories, direct revenue to their homestays, and provide a fee-free marketplace for their ancestral handicrafts.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">AI for Good</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use AI not to replace the human experience, but to optimize it. Our itinerary planner balances foot traffic across regions to prevent over-tourism in sensitive areas while still delivering incredible trips.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Hidden but Protected</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reveal hidden gems, but we rate them based on their ecological carrying capacity. Some places are too fragile for mass tourism, and our platform actively discourages large groups from visiting them.
              </p>
            </motion.div>
          </motion.div>

          {/* Letter section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 p-8 md:p-12 glass-card rounded-2xl border-l-4 border-l-primary relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Leaf className="w-48 h-48" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-serif font-bold mb-6">The Unexplored Land</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-serif text-lg">
                <p>
                  "Jharkhand literally translates to 'The Land of Forests'. For decades, it remained off the standard tourist map, known only for its minerals rather than its immense natural beauty."
                </p>
                <p>
                  "We created this platform because we saw the waterfalls cascading in isolation and the tribal artisans creating masterpieces without a market. We wanted to open the doors, but we wanted to do it right."
                </p>
                <p>
                  "Welcome to the wild soul of India. Tread lightly."
                </p>
              </div>
              <div className="mt-8">
                <p className="font-bold text-foreground">— The EcoJharkhand Team</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
