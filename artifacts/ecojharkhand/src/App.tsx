import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import Planner from "@/pages/planner";
import EcoScore from "@/pages/eco-score";
import Dashboard from "@/pages/dashboard";
import Handicrafts from "@/pages/handicrafts";
import Budget from "@/pages/budget";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/explore" component={Explore} />
        <Route path="/planner" component={Planner} />
        <Route path="/eco" component={EcoScore} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/handicrafts" component={Handicrafts} />
        <Route path="/budget" component={Budget} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
