import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, MapPin, Leaf, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDashboardStats, useListDestinations } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: featuredDestinations, isLoading: destinationsLoading } = useListDestinations({ featured: true });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-waterfall.png" 
            alt="Jharkhand Waterfall" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium tracking-wider mb-6">
              THE UNEXPLORED LAND
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Discover the <span className="text-gradient">Wild Soul</span> of India
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Step into a living map of hidden waterfalls, dense forests, and ancient tribal heritage. Travel responsibly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8 rounded-full shadow-[0_0_20px_rgba(230,162,60,0.3)]">
                  Start Exploring
                </Button>
              </Link>
              <Link href="/planner">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-primary/50 text-primary hover:bg-primary/10">
                  Plan Itinerary
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 relative z-20 -mt-10">
        <div className="container px-4 md:px-6">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-muted rounded-xl"></div>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
              >
                <motion.div variants={item} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">{stats?.totalDestinations || 0}</h3>
                  <p className="text-sm text-muted-foreground">Hidden Gems</p>
                </motion.div>
                <motion.div variants={item} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">{stats?.totalEcoUsers || 0}</h3>
                  <p className="text-sm text-muted-foreground">Eco Travelers</p>
                </motion.div>
                <motion.div variants={item} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent-foreground/10 rounded-full flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">{stats?.totalReviews || 0}</h3>
                  <p className="text-sm text-muted-foreground">Traveler Reviews</p>
                </motion.div>
                <motion.div variants={item} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                    <Leaf className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">{stats?.totalHandicrafts || 0}</h3>
                  <p className="text-sm text-muted-foreground">Local Artisans</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">Featured Experiences</h2>
              <p className="text-muted-foreground max-w-2xl">Curated destinations offering the best of nature, culture, and sustainability.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 gap-2">
                View all destinations <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-card rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDestinations?.slice(0, 3).map((dest, i) => (
                <motion.div 
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl overflow-hidden glass-card flex flex-col h-full cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={dest.imageUrl} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded backdrop-blur-sm mb-2 inline-block uppercase tracking-wider">
                          {dest.category}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white leading-tight">{dest.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-primary">
                        <Leaf className="w-3 h-3" />
                        <span className="text-xs font-bold">{dest.ecoScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {dest.description}
                    </p>
                    <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-card-border">
                      <div className="flex items-center text-muted-foreground gap-1">
                        <Star className="w-4 h-4 text-secondary fill-secondary" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {dest.location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Recent Activity */}
      <section className="py-16 bg-muted/20 border-y border-border/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-10 text-center">Community Impact</h2>
          
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 md:p-8">
            {statsLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentActivity?.slice(0, 5).map((activity, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-card-border hover:border-primary/30 transition-colors"
                  >
                    <div className="bg-primary/10 p-3 rounded-full mt-1">
                      {activity.type === 'eco_score' ? (
                        <Leaf className="w-5 h-5 text-primary" />
                      ) : activity.type === 'review' ? (
                        <Star className="w-5 h-5 text-secondary" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-accent-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="mt-8 text-center">
              <Link href="/eco">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-full">
                  Join the Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
