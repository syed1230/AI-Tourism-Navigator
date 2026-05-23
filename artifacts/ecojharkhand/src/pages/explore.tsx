import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Leaf, BookOpen, ChevronDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useListDestinations } from "@workspace/api-client-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CATEGORIES = ["all", "waterfall", "forest", "village", "temple", "eco"];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  
  const { data: destinations, isLoading } = useListDestinations({
    search: search || undefined,
    category: category !== "all" ? category : undefined
  });

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Explore Jharkhand</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Discover hidden waterfalls, ancient temples, and vibrant tribal villages. 
          Travel with respect for the land and its people.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search destinations..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-card border-card-border focus-visible:ring-primary text-base"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                category === cat 
                  ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(230,162,60,0.3)]" 
                  : "bg-card text-muted-foreground border border-card-border hover:border-primary/50"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {destinations?.map((dest, i) => (
              <motion.div
                key={dest.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={dest.imageUrl} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-white text-sm font-bold">{dest.ecoScore}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded backdrop-blur-sm mb-2 inline-block uppercase tracking-wider">
                      {dest.category}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white leading-tight">{dest.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-secondary" /> {dest.location}
                    </span>
                    <div className="flex items-center text-muted-foreground gap-1">
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                      <span>{dest.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {dest.description}
                  </p>

                  <div className="mt-auto">
                    <Collapsible className="w-full border-t border-card-border pt-4">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full flex justify-between p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80">
                          <span className="flex items-center gap-2 font-serif text-base">
                            <BookOpen className="w-4 h-4" />
                            Tribal Story & Heritage
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4 space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <strong className="text-foreground block mb-1">Local Tradition:</strong>
                          {dest.traditions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong className="text-foreground block mb-1">Cultural Significance:</strong>
                          {dest.culturalInfo}
                        </div>
                        <div className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3 py-1">
                          "{dest.tribalStory}"
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && destinations?.length === 0 && (
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-serif font-bold text-foreground mb-2">No destinations found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
