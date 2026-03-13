import { Link, useNavigate } from '@tanstack/react-router';
import { Search, Menu, X, Shield, BarChart3, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery } });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">
              Plugin<span className="text-primary">Trust</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/category/seo" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              SEO Plugins
            </Link>
            <Link 
              to="/category/security" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Security
            </Link>
            <Link 
              to="/category/page-builders" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Page Builders
            </Link>
            <Link 
              to="/category/performance" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Performance
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-secondary/50 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <Star className="w-4 h-4" />
              <span>Write Review</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg">
              <TrendingUp className="w-4 h-4" />
              <span>Top Rated</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-secondary/50 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </form>
            <div className="space-y-2">
              <Link 
                to="/category/seo" 
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                SEO Plugins
              </Link>
              <Link 
                to="/category/security" 
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Security
              </Link>
              <Link 
                to="/category/page-builders" 
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Page Builders
              </Link>
              <Link 
                to="/category/performance" 
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Performance
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
