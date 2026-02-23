import { Outlet, useNavigate } from '@tanstack/react-router';
import { Utensils, Heart } from 'lucide-react';
import CartButton from './CartButton';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 font-display text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <Utensils className="h-7 w-7" />
            Quick Resto
          </button>
          <nav className="ml-auto flex items-center gap-4">
            <button
              onClick={() => navigate({ to: '/' })}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Browse Restaurants
            </button>
            <button
              onClick={() => navigate({ to: '/orders' })}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Order History
            </button>
            <CartButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Quick Resto</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'quick-resto'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
