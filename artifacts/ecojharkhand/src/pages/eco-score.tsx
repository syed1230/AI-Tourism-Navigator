import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, Leaf, Medal, Award, Star, Plus, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useGetEcoLeaderboard, useAddEcoScore } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getGetEcoLeaderboardQueryKey } from "@workspace/api-client-react";

const actionPoints = {
  eco_transport: 20,
  homestay: 50,
  local_artisan: 30,
  no_plastic: 15,
  trail_cleanup: 40
};

const formSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  action: z.enum(["eco_transport", "homestay", "local_artisan", "no_plastic", "trail_cleanup"])
});

const getBadgeIcon = (badge: string) => {
  switch(badge.toLowerCase()) {
    case 'seed': return <Leaf className="w-5 h-5 text-amber-600" />;
    case 'sapling': return <Leaf className="w-5 h-5 text-green-500" />;
    case 'tree': return <Star className="w-5 h-5 text-primary" />;
    case 'forest': return <Medal className="w-5 h-5 text-blue-400" />;
    case 'guardian': return <Shield className="w-5 h-5 text-purple-500" />;
    default: return <Award className="w-5 h-5 text-muted-foreground" />;
  }
};

const getBadgeColor = (badge: string) => {
  switch(badge.toLowerCase()) {
    case 'seed': return 'bg-amber-600/10 text-amber-600 border-amber-600/20';
    case 'sapling': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'tree': return 'bg-primary/10 text-primary border-primary/20';
    case 'forest': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    case 'guardian': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default: return 'bg-muted/10 text-muted-foreground border-muted/20';
  }
};

export default function EcoScore() {
  const { data: leaderboard, isLoading } = useGetEcoLeaderboard();
  const { mutate: addScore, isPending } = useAddEcoScore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      action: "no_plastic"
    }
  });

  const selectedAction = form.watch("action");
  const pointsToEarn = actionPoints[selectedAction as keyof typeof actionPoints] || 0;

  function onSubmit(values: z.infer<typeof formSchema>) {
    addScore({
      data: {
        userName: values.userName,
        action: values.action,
        points: actionPoints[values.action as keyof typeof actionPoints]
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Points Awarded!",
          description: `You earned ${actionPoints[values.action as keyof typeof actionPoints]} points for ${values.action.replace('_', ' ')}.`,
        });
        queryClient.invalidateQueries({ queryKey: getGetEcoLeaderboardQueryKey() });
        form.reset({ ...values, action: "no_plastic" });
      }
    });
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Eco Leaderboard</h1>
        <p className="text-xl text-muted-foreground">
          Travel sustainably, earn points, and unlock badges. Join the community protecting Jharkhand's heritage.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Log Action Form */}
        <div className="lg:col-span-1 glass-card p-6 md:p-8 rounded-2xl">
          <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Log Eco Action
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rahul Kumar" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sustainable Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no_plastic">Avoided single-use plastic (+15 pts)</SelectItem>
                        <SelectItem value="eco_transport">Used public/eco transport (+20 pts)</SelectItem>
                        <SelectItem value="local_artisan">Bought from local artisan (+30 pts)</SelectItem>
                        <SelectItem value="trail_cleanup">Participated in trail cleanup (+40 pts)</SelectItem>
                        <SelectItem value="homestay">Stayed in a village homestay (+50 pts)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Points to earn:</span>
                <span className="text-2xl font-bold font-serif text-primary">+{pointsToEarn}</span>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging..." : "Log Action"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-8 border-t border-card-border">
            <h4 className="font-serif font-bold mb-4">Badge Tiers</h4>
            <div className="space-y-3">
              {[
                { name: 'Seed', pts: '0+', color: 'text-amber-600' },
                { name: 'Sapling', pts: '100+', color: 'text-green-500' },
                { name: 'Tree', pts: '300+', color: 'text-primary' },
                { name: 'Forest', pts: '600+', color: 'text-blue-400' },
                { name: 'Guardian', pts: '1000+', color: 'text-purple-500' }
              ].map(tier => (
                <div key={tier.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${tier.color}`} />
                    {tier.name}
                  </span>
                  <span className="text-muted-foreground">{tier.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-card-border bg-card flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold">Top Eco Travelers</h2>
          </div>
          
          <div className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-card-border">
                {leaderboard?.map((user, index) => (
                  <motion.div 
                    key={user.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 md:p-6 flex items-center gap-4 hover:bg-card/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${index === 0 ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(230,162,60,0.5)]' : 
                        index === 1 ? 'bg-zinc-300 text-zinc-800' : 
                        index === 2 ? 'bg-amber-700 text-white' : 
                        'bg-background text-muted-foreground border border-border'}`}
                    >
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.actions?.length || 0} eco actions logged
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-serif font-bold text-foreground">
                        {user.totalPoints} <span className="text-sm font-sans text-muted-foreground font-normal">pts</span>
                      </div>
                      <div className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold capitalize ${getBadgeColor(user.badge)}`}>
                        {getBadgeIcon(user.badge)}
                        {user.badge}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {!isLoading && leaderboard?.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Leaf className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No eco actions logged yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
