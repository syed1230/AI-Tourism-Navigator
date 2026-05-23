import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Map, Calendar, Wallet, Users, Compass, Leaf, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useGenerateItinerary } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  days: z.coerce.number().min(1).max(14),
  budget: z.coerce.number().min(1000),
  travelType: z.string().min(1),
  interests: z.array(z.string()).min(1, "Select at least one interest")
});

const INTERESTS = [
  { id: "nature", label: "Nature & Forests" },
  { id: "tribal culture", label: "Tribal Culture" },
  { id: "waterfalls", label: "Waterfalls" },
  { id: "adventure", label: "Adventure" },
  { id: "wildlife", label: "Wildlife" },
  { id: "temples", label: "Ancient Temples" },
  { id: "villages", label: "Village Tourism" }
];

export default function Planner() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: 3,
      budget: 5000,
      travelType: "solo",
      interests: ["nature"]
    }
  });

  const { mutate: generate, data: itinerary, isPending } = useGenerateItinerary();

  function onSubmit(values: z.infer<typeof formSchema>) {
    generate({ data: values });
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">AI Itinerary Planner</h1>
        <p className="text-xl text-muted-foreground">
          Let our AI craft a personalized, eco-friendly journey through Jharkhand based on your interests and budget.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Planner Form */}
        <div className="lg:col-span-4 glass-card p-6 md:p-8 rounded-2xl sticky top-24">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Map className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-xl font-bold">Trip Details</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="number" {...field} className="pl-10 bg-background/50" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget (INR)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                          <Input type="number" {...field} className="pl-8 bg-background/50" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="solo">Solo Explorer</SelectItem>
                          <SelectItem value="couple">Couple</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="group">Group/Friends</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Compass className="w-5 h-5 text-secondary" />
                  <h3 className="font-serif text-xl font-bold">Interests</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-3">
                        {INTERESTS.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-card-border p-3 hover:bg-card/50 transition-colors"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Itinerary <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          {!itinerary && !isPending && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card rounded-2xl border-dashed border-2">
              <Map className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-serif text-muted-foreground">Your Journey Awaits</h3>
              <p className="text-muted-foreground max-w-md mt-2">Fill out the details to generate a custom itinerary tailored to your preferences.</p>
            </div>
          )}

          {isPending && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 h-48 animate-pulse" />
              ))}
            </div>
          )}

          {itinerary && !isPending && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-2xl p-6 bg-primary/5 border-primary/20">
                <h2 className="text-2xl font-serif font-bold text-primary mb-2">Trip Summary</h2>
                <p className="text-foreground leading-relaxed">{itinerary.summary}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">₹{itinerary.totalEstimatedCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold flex items-center gap-2">
                  Day by Day Plan
                </h3>
                
                {itinerary.days.map((day, i) => (
                  <motion.div 
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden"
                  >
                    <div className="bg-card p-4 border-b border-card-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-serif font-bold text-lg">
                          {day.day}
                        </div>
                        <h4 className="font-serif text-lg font-bold text-foreground">Day {day.day}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                        <Leaf className="w-4 h-4" />
                        {day.ecoScore} Eco Points
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <h5 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Destinations</h5>
                        <div className="flex flex-wrap gap-2">
                          {day.destinations.map((dest, idx) => (
                            <span key={idx} className="bg-background border border-border px-3 py-1 rounded-md text-sm text-foreground flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-secondary" />
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Activities</h5>
                        <ul className="space-y-2">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-foreground">
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-card-border">
                        <div>
                          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Stay</h5>
                          <p className="text-sm text-foreground">{day.accommodation}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Est. Cost</h5>
                          <p className="text-sm text-foreground">₹{day.estimatedCost.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-6 bg-green-900/20 border-green-500/30">
                <h3 className="text-xl font-serif font-bold text-green-500 flex items-center gap-2 mb-4">
                  <Leaf className="w-5 h-5" /> Eco-Travel Tips for this Trip
                </h3>
                <ul className="space-y-3">
                  {itinerary.ecoTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-green-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
