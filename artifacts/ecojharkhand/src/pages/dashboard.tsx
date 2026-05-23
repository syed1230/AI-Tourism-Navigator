import React from "react";
import { motion } from "framer-motion";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { BarChart3, Map, Users, Star, MessageSquare, ShieldCheck, Leaf } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
  positive: 'hsl(147, 40%, 40%)',
  neutral: 'hsl(35, 90%, 50%)',
  negative: 'hsl(0, 70%, 45%)',
  categories: [
    'hsl(147, 40%, 40%)',
    'hsl(35, 90%, 50%)', 
    'hsl(15, 80%, 45%)',
    'hsl(200, 60%, 40%)',
    'hsl(280, 50%, 50%)'
  ]
};

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="container py-10 px-4">
        <div className="h-10 w-64 bg-card rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-card rounded-xl animate-pulse" />
          <div className="h-96 bg-card rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const sentimentData = [
    { name: 'Positive', value: stats?.sentimentBreakdown.positive || 0, color: COLORS.positive },
    { name: 'Neutral', value: stats?.sentimentBreakdown.neutral || 0, color: COLORS.neutral },
    { name: 'Negative', value: stats?.sentimentBreakdown.negative || 0, color: COLORS.negative },
  ];

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of EcoJharkhand platform metrics</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-card-border">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">System Healthy</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Destinations", value: stats?.totalDestinations, icon: Map, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Eco Travelers", value: stats?.totalEcoUsers, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Total Reviews", value: stats?.totalReviews, icon: Star, color: "text-primary", bg: "bg-primary/10" },
          { label: "Local Artisans", value: stats?.totalHandicrafts, icon: Leaf, color: "text-secondary", bg: "bg-secondary/10" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-none shadow-md hover:border-primary/20 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-serif font-bold text-foreground">{stat.value || 0}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Destinations by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.categoryBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="category" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    style={{ textTransform: 'capitalize' }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                    {stats?.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sentiment Analysis Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                Review Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
                <span className="text-3xl font-serif font-bold text-foreground">
                  {stats?.sentimentBreakdown.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 fill-primary text-primary" /> Avg Rating
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reviews Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Destination</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                    <th className="px-6 py-4 font-semibold">Sentiment</th>
                    <th className="px-6 py-4 font-semibold">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats?.sentimentBreakdown.recentReviews?.slice(0, 5).map((review) => (
                    <tr key={review.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{review.userName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{review.destinationName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="font-medium text-foreground">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                          ${review.sentiment === 'positive' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                            review.sentiment === 'negative' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                        >
                          {review.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-[300px] truncate" title={review.text}>
                        {review.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stats?.sentimentBreakdown.recentReviews?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No reviews available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
