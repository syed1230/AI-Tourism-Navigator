import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Store, Tag, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useListHandicrafts } from "@workspace/api-client-react";

const CATEGORIES = ["all", "pottery", "weaving", "painting", "jewelry", "bamboo", "wood"];

export default function Handicrafts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  
  const { data: handicrafts, isLoading } = useListHandicrafts({
    search: search || undefined,
    category: category !== "all" ? category : undefined
  });

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-4">
          <Store className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Tribal Marketplace</h1>
        <p className="text-xl text-muted-foreground">
          Support local artisans directly. Authentic, sustainable, handcrafted goods from the villages of Jharkhand.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search handicrafts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-card border-card-border focus-visible:ring-secondary text-base"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                category === cat 
                  ? "bg-secondary text-secondary-foreground shadow-[0_0_10px_rgba(200,80,40,0.3)]" 
                  : "bg-card text-muted-foreground border border-card-border hover:border-secondary/50"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {handicrafts?.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-card border-b border-card-border">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider border border-white/10">
                      {item.category}
                    </span>
                  </div>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded font-bold text-sm">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-serif font-bold text-foreground leading-tight line-clamp-2">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {item.description}
                  </p>

                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.village}</span>
                      </div>
                      <div className="text-muted-foreground">
                        By <span className="font-medium text-foreground">{item.artisan}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-card-border">
                      <div className="text-xl font-serif font-bold text-secondary">
                        ₹{item.price.toLocaleString()}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full"
                        disabled={!item.inStock}
                      >
                        Contact Artisan
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && handicrafts?.length === 0 && (
        <div className="text-center py-20">
          <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-serif font-bold text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
