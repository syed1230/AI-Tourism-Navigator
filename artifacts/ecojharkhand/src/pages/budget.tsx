import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, Wallet, PieChart as PieChartIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useCalculateBudget } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const formSchema = z.object({
  days: z.coerce.number().min(1).max(30),
  travelType: z.string().min(1),
  accommodationType: z.string().min(1),
  transportType: z.string().min(1),
  includeLocalShopping: z.boolean().default(true),
});

const COLORS = ['hsl(35, 90%, 50%)', 'hsl(147, 40%, 40%)', 'hsl(15, 80%, 45%)', 'hsl(200, 60%, 40%)', 'hsl(280, 50%, 50%)'];

export default function Budget() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: 5,
      travelType: "couple",
      accommodationType: "mid-range",
      transportType: "public",
      includeLocalShopping: true
    }
  });

  const { mutate: calculate, data: result, isPending } = useCalculateBudget();

  function onSubmit(values: z.infer<typeof formSchema>) {
    calculate({ data: values });
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Trip Estimator</h1>
        <p className="text-xl text-muted-foreground">
          Plan your finances. Get a realistic breakdown of costs for traveling in Jharkhand.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-4 glass-card p-6 md:p-8 rounded-2xl sticky top-24">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-bold">Trip Parameters</h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-background/50" />
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
                    <FormLabel>Group Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select group size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solo">Solo Explorer (1)</SelectItem>
                        <SelectItem value="couple">Couple (2)</SelectItem>
                        <SelectItem value="family">Family (3-4)</SelectItem>
                        <SelectItem value="group">Group (5+)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accommodationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select stay type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="budget">Budget / Hostels</SelectItem>
                        <SelectItem value="homestay">Eco Village Homestays</SelectItem>
                        <SelectItem value="mid-range">Mid-range Hotels</SelectItem>
                        <SelectItem value="luxury">Luxury Resorts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public (Bus/Train)</SelectItem>
                        <SelectItem value="shared">Shared Cabs</SelectItem>
                        <SelectItem value="eco">Eco-Transport (Cycles/EVs)</SelectItem>
                        <SelectItem value="private">Private Taxi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeLocalShopping"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-card-border p-4 bg-background/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Include Handicrafts Budget
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Support local artisans by allocating funds for souvenirs
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Calculating..." : "Calculate Estimate"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          {!result && !isPending && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card rounded-2xl border-dashed border-2">
              <Wallet className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-serif text-muted-foreground">Cost Breakdown</h3>
              <p className="text-muted-foreground max-w-md mt-2">Enter your trip details to see a realistic budget estimation.</p>
            </div>
          )}

          {isPending && (
            <div className="space-y-6">
              <div className="h-48 glass-card rounded-2xl animate-pulse" />
              <div className="h-80 glass-card rounded-2xl animate-pulse" />
            </div>
          )}

          {result && !isPending && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Grand Total */}
              <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Estimated Cost</p>
                  <h2 className="text-5xl font-serif font-bold text-foreground">₹{result.total.toLocaleString()}</h2>
                </div>
                <div className="w-full md:w-px h-px md:h-16 bg-border" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Per Person Cost</p>
                  <h3 className="text-3xl font-serif font-bold text-primary">₹{result.perPersonCost.toLocaleString()}</h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Visual Chart */}
                <div className="glass-card rounded-2xl p-6 flex flex-col">
                  <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-secondary" />
                    Distribution
                  </h3>
                  <div className="flex-1 min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.breakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="amount"
                          stroke="none"
                        >
                          {result.breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `₹${value.toLocaleString()}`}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-serif text-xl font-bold mb-6">Line Items</h3>
                  <div className="space-y-4">
                    {result.breakdown.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div>
                            <p className="font-medium text-foreground capitalize">{item.category}</p>
                            <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% of budget</p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-foreground">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
