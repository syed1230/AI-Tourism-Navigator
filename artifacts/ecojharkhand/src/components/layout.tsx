import React from "react";
import { Link, useLocation } from "wouter";
import { 
  MapPin, 
  Compass, 
  Map, 
  Leaf, 
  BarChart3, 
  ShoppingBag, 
  Calculator, 
  Info,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: MapPin },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/planner", label: "AI Planner", icon: Map },
  { href: "/eco", label: "Eco Score", icon: Leaf },
  { href: "/handicrafts", label: "Marketplace", icon: ShoppingBag },
  { href: "/budget", label: "Budget", icon: Calculator },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/about", label: "About", icon: Info },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLinks = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Leaf className="w-6 h-6 text-primary" />
        </div>
        <span className="font-serif text-xl font-bold tracking-wider text-primary">EcoJharkhand</span>
      </div>
      <nav className="flex flex-col gap-2 px-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium border border-primary/20 shadow-[0_0_10px_rgba(230,162,60,0.1)]" 
                    : "text-muted-foreground hover:bg-card hover:text-foreground hover:border-card-border border border-transparent"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-card/50 border border-card-border p-4 rounded-xl text-sm text-muted-foreground text-center">
          <p className="font-serif italic">"Leave nothing but footprints"</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar/50 backdrop-blur-xl sticky top-0 h-screen z-40">
        <NavLinks />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-serif font-bold text-primary">EcoJharkhand</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r-border flex flex-col">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <NavLinks />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
