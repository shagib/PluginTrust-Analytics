import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Link,
  Outlet,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import {
  Shield, Search, Star, TrendingUp, BarChart3, CheckCircle2, Users,
  Download, ArrowRight, X, ChevronDown, Menu, ExternalLink,
  ThumbsUp, Filter, ArrowLeft, Lock, AlertTriangle, Globe, Zap,
  ShieldCheck, ShieldAlert, Activity, Eye, EyeOff, Info, ChevronRight,
  LayoutDashboard, AlertCircle, Check, RefreshCw, Crown, Sparkles
} from 'lucide-react';
import { useState, useEffect, Suspense, lazy } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  plugins, categories, getPluginBySlug, getReviewsForPlugin,
  getAnalyticsForPlugin, formatNumber, formatDate,
  searchPlugins, getPluginsByCategory, type Plugin, type Review,
  type SecurityAnalysis, type FakeReviewAnalysis, type ProFeatureData,
  getSecurityAnalysis, getFakeReviewAnalysis, getProFeatureData,
  generateSecurityAnalysis, generateFakeReviewAnalysis, calculateTrustScore
} from './lib/data';
import {
  getWordPressPlugin,
  searchWordPressPlugins,
  transformWPPlugin,
  getPopularPlugins,
  type WPPlugin
} from './lib/wordpress-api';

// ─── ROUTES ─────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  validateSearch: z.object({ q: z.string().optional() }),
  component: SearchPage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: CategoryPage,
});

const pluginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plugin/$pluginSlug',
  component: PluginDetailPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
});

const routeTree = rootRoute.addChildren([indexRoute, searchRoute, categoryRoute, pluginRoute, pricingRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}

// ─── ROOT LAYOUT ─────────────────────────────────────────────────────────────
function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: '/search', search: { q: query.trim() } });
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:block">
              Plugin<span className="text-teal-600">Trust</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-1 ml-2">
            {categories.slice(0, 4).map(cat => (
              <Link
                key={cat.id}
                to="/category/$categoryId"
                params={{ categoryId: cat.id }}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/pricing"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-full transition-all"
            >
              <span>Pricing</span>
            </Link>
            <Link
              to="/search"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-all shadow-md"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Top Rated</span>
            </Link>
            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 pt-4 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to="/category/$categoryId"
                  params={{ categoryId: cat.id }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-teal-50 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">PluginTrust</span>
            </div>
            <p className="text-sm text-slate-400">
              Verified reviews for WordPress plugins. Make decisions based on real data.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-white">Categories</h4>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to="/category/$categoryId" params={{ categoryId: cat.id }}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-white">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Security Analysis</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Fake Review Detection</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Pro Analytics</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © 2026 PluginTrust Analytics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`${sz} ${s <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
      ))}
    </div>
  );
}

// ─── PLUGIN CARD ─────────────────────────────────────────────────────────────
function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <Link
      to="/plugin/$pluginSlug"
      params={{ pluginSlug: plugin.slug }}
      className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-teal-500/30 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden h-full"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 -mr-8 -mt-8 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-teal-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
            {plugin.icon ? (
              typeof plugin.icon === 'string' && plugin.icon.length > 2 ? (
                <img src={plugin.icon} alt={plugin.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">{plugin.icon}</span>
              )
            ) : (
              <Shield className="w-6 h-6 text-teal-600" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors truncate leading-tight">
              {plugin.name}
            </h3>
            <p className="text-sm text-slate-500 truncate mt-0.5">by {plugin.developer}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed h-10">{plugin.description}</p>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex flex-col gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-slate-700">{(plugin.rating || 0).toFixed(1)}</span>
            <span className="text-[10px] text-slate-400">({formatNumber(plugin.reviewCount || 0)})</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Installs</span>
          <div className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-sm font-bold text-slate-700">{formatNumber(plugin.activeInstalls)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-teal-600">
            {formatNumber(plugin.verifiedReviews || 0)} Verified Reviews
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-teal-600 transition-colors">
          <span className="text-xs font-bold uppercase tracking-wider">Details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

// ─── REVIEW CARD ─────────────────────────────────────────────────────────────
function ReviewCard({ review, showFlag = false, flaggedReasons = [] }: { review: Review; showFlag?: boolean; flaggedReasons?: string[] }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${showFlag ? 'border-red-200 bg-red-50/50' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0">
            {review.userInitials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm text-slate-900">{review.userName}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
              {showFlag && (
                <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Flagged
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{review.verifiedSite}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <h4 className="font-semibold text-sm mb-1.5 text-slate-900">{review.title}</h4>
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{review.content}</p>

      {showFlag && flaggedReasons.length > 0 && (
        <div className="mb-3 p-2 bg-red-100 rounded-lg">
          <p className="text-xs font-medium text-red-700 mb-1">Suspicious indicators:</p>
          <ul className="text-xs text-red-600 space-y-0.5">
            {flaggedReasons.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <p className="font-medium text-green-700 mb-1">✓ Pros</p>
          <ul className="space-y-0.5 text-slate-600">
            {review.pros.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-medium text-red-600 mb-1">✗ Cons</p>
          <ul className="space-y-0.5 text-slate-600">
            {review.cons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span>{formatDate(review.createdAt)}</span>
        <button
          className="flex items-center gap-1 hover:text-teal-600 transition-colors"
          onClick={() => toast.success('Marked as helpful!')}
        >
          <ThumbsUp className="w-3 h-3" />
          Helpful ({review.helpfulCount})
        </button>
      </div>
    </div>
  );
}

// ─── SECURITY SCORE COMPONENT ────────────────────────────────────────────────
function SecurityScoreCard({ security }: { security: SecurityAnalysis }) {
  const scoreColor = security.overallScore >= 80 ? 'text-green-600' : security.overallScore >= 60 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = security.overallScore >= 80 ? 'bg-green-100' : security.overallScore >= 60 ? 'bg-amber-100' : 'bg-red-100';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          Security Analysis
        </h3>
        <span className={`text-2xl font-bold ${scoreColor}`}>{security.overallScore}%</span>
      </div>

      <div className={`w-full h-2 bg-slate-100 rounded-full mb-4 ${scoreBg}`}>
        <div
          className={`h-full rounded-full transition-all ${security.overallScore >= 80 ? 'bg-green-500' : security.overallScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${security.overallScore}%` }}
        />
      </div>

      {security.vulnerabilities.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-2">
            <ShieldAlert className="w-4 h-4" />
            Known Vulnerabilities
          </div>
          {security.vulnerabilities.map((v, i) => (
            <div key={i} className="text-xs text-red-600 mb-1">
              <span className={`px-1.5 py-0.5 rounded text-white text-[10px] uppercase ${v.severity === 'critical' ? 'bg-red-600' : v.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                {v.severity}
              </span>
              {' '}{v.description}
              {v.fixedIn && <span className="text-slate-500"> (Fixed in {v.fixedIn})</span>}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {security.factors.map((factor, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">{factor.name}</span>
              <span className="font-medium text-slate-900">{factor.score}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRUST SCORE COMPONENT ─────────────────────────────────────────────────
function TrustScoreCard({ trustScore }: { trustScore: ReturnType<typeof calculateTrustScore> }) {
  const gradeColor = (grade: string) => {
    if (grade.startsWith('A')) return { bg: 'bg-green-500', text: 'text-green-600', ring: 'ring-green-500' };
    if (grade.startsWith('B')) return { bg: 'bg-teal-500', text: 'text-teal-600', ring: 'ring-teal-500' };
    if (grade.startsWith('C')) return { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-500' };
    return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-500' };
  };
  
  const colors = gradeColor(trustScore.grade);
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          Plugin Trust Score
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${colors.text}`}>{trustScore.overallScore}</span>
          <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center ring-4 ${colors.ring}/30`}>
            <span className="text-white font-bold text-sm">{trustScore.grade}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full mb-4">
        <div
          className={`h-full rounded-full transition-all ${colors.bg}`}
          style={{ width: `${trustScore.overallScore}%` }}
        />
      </div>

      <div className="space-y-3">
        {trustScore.breakdown.map((factor, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">{factor.name}</span>
              <span className="font-medium text-slate-900">{factor.score}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAKE REVIEW ANALYSIS COMPONENT ──────────────────────────────────────────
function FakeReviewAnalysisCard({ analysis }: { analysis: FakeReviewAnalysis }) {
  const [showFlagged, setShowFlagged] = useState(false);
  const reviews = getReviewsForPlugin(analysis.pluginId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-teal-600" />
          Fake Review Detection
        </h3>
        <button
          onClick={() => setShowFlagged(!showFlagged)}
          className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          {showFlagged ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showFlagged ? 'Hide' : 'Show'} flagged
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">{analysis.realPercentage}%</div>
          <div className="text-xs text-green-700">Real Reviews</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-xl font-bold text-amber-600">{analysis.suspiciousPercentage}%</div>
          <div className="text-xs text-amber-700">Suspicious</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xl font-bold text-red-600">{analysis.fakePercentage}%</div>
          <div className="text-xs text-red-700">Fake</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex h-3 rounded-full overflow-hidden">
          <div className="bg-green-500" style={{ width: `${analysis.realPercentage}%` }} />
          <div className="bg-amber-400" style={{ width: `${analysis.suspiciousPercentage}%` }} />
          <div className="bg-red-500" style={{ width: `${analysis.fakePercentage}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700 mb-1">Sentiment Analysis</div>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Positive: {analysis.sentimentAnalysis.positive}%
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            Neutral: {analysis.sentimentAnalysis.neutral}%
          </span>
          <span className="flex items-center gap-1 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Negative: {analysis.sentimentAnalysis.negative}%
          </span>
        </div>
      </div>

      {showFlagged && analysis.flaggedReviews.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-xs font-medium text-slate-700 mb-2">Flagged Reviews ({analysis.flaggedReviews.length})</div>
          {analysis.flaggedReviews.map(flag => (
            <div key={flag.id} className="mb-2 p-2 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-red-700">{flag.reason}</span>
                <span className="text-xs text-red-500">{flag.confidence}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PRO FEATURES COMPONENT (WEBSITES USING PLUGIN) ─────────────────────────
function ProWebsitesCard({ data, isPro = false }: { data: ProFeatureData; isPro?: boolean }) {
  if (!isPro) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-slate-900">Pro Feature</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          See which websites are using this plugin. Upgrade to Pro to unlock this data.
        </p>
        <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Upgrade to Pro
        </button>
      </div>
    );
  }

  const trafficColor = (t: string) => {
    if (t === 'very-high') return 'bg-green-500';
    if (t === 'high') return 'bg-teal-500';
    if (t === 'medium') return 'bg-amber-500';
    return 'bg-slate-400';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-600" />
          Websites Using This Plugin
        </h3>
        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
          {data.websites.length} detected
        </span>
      </div>

      <div className="space-y-3">
        {data.websites.map((site, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-teal-600 hover:underline truncate">
                  {site.domain}
                </a>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${trafficColor(site.estimatedTraffic)}`} />
                  {site.estimatedTraffic.replace('-', ' ')}
                </span>
                <span>•</span>
                <span>{site.country}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex gap-1">
                {site.techStack?.slice(0, 2).map((t, j) => (
                  <span key={j} className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS DASHBOARD COMPONENT ──────────────────────────────────────────
function AnalyticsDashboard({ pluginId }: { pluginId: string }) {
  const analytics = getAnalyticsForPlugin(pluginId);
  
  if (!analytics) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          <h3 className="font-semibold text-slate-900">Usage Analytics</h3>
        </div>
        <p className="text-sm text-slate-500">No analytics data available for this plugin.</p>
      </div>
    );
  }

  const maxInstalls = Math.max(...analytics.installsOverTime.map(d => d.count));
  const maxRating = Math.max(...analytics.ratingBreakdown.map(r => r.count));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-slate-900">Live Usage Analytics</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-teal-50 rounded-lg">
          <p className="text-xs text-teal-600 mb-1">Active Installs</p>
          <p className="text-2xl font-bold text-teal-700">{formatNumber(analytics.activeInstalls)}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-xs text-green-600 mb-1">8-Month Growth</p>
          <p className="text-2xl font-bold text-green-700">
            +{(((analytics.installsOverTime.at(-1)!.count - analytics.installsOverTime[0].count) / analytics.installsOverTime[0].count) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-600 mb-1">On Latest Version</p>
          <p className="text-2xl font-bold text-amber-700">{analytics.versionDistribution[0].percentage}%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Install Growth (8 Months)</h4>
          <div className="flex items-end gap-1.5 h-32">
            {analytics.installsOverTime.map((d, i) => {
              const h = (d.count / maxInstalls) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t transition-opacity group-hover:opacity-80"
                    style={{ height: `${h}%`, minHeight: '4px' }}
                    title={`${formatNumber(d.count)} installs`}
                  />
                  <span className="text-[10px] text-slate-400">{d.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Version Distribution</h4>
          <div className="space-y-2">
            {analytics.versionDistribution.map((v, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">{v.version}</span>
                  <span className="font-medium text-slate-900">{v.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${v.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REVIEW FORM MODAL ───────────────────────────────────────────────────────
function ReviewModal({ plugin, onClose }: { plugin: Plugin; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [site, setSite] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    if (!title.trim()) { toast.error('Please add a review title'); return; }
    if (!content.trim() || content.length < 50) { toast.error('Review must be at least 50 characters'); return; }
    if (!site.trim()) { toast.error('Please enter your WordPress site URL to verify'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success('Review submitted! It will appear after verification (1–2 days).');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Write a Review</h2>
            <p className="text-xs text-slate-500">{plugin.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium block mb-2 text-slate-700">Your Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="p-1">
                  <Star className={`w-7 h-7 transition-colors ${s <= (hover || rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                </button>
              ))}
              {rating > 0 && <span className="ml-2 text-sm text-slate-500 self-center">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</span>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-slate-700">
              Your WordPress Site URL *
              <span className="ml-2 text-xs text-teal-600 font-normal">— required for verification</span>
            </label>
            <input type="url" placeholder="https://yoursite.com" value={site} onChange={e => setSite(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
            <p className="text-xs text-slate-500 mt-1">We'll verify you actually have this plugin installed</p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-slate-700">Review Title *</label>
            <input type="text" placeholder="Summarize your experience" value={title} onChange={e => setTitle(e.target.value)} maxLength={100}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-slate-700">Review *</label>
            <textarea placeholder="Share your detailed experience (min. 50 characters)..." value={content} onChange={e => setContent(e.target.value)} rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none" />
            <p className="text-xs text-slate-500 mt-1">{content.length}/50 min characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1 text-green-700">Pros</label>
              <textarea placeholder="One per line..." value={pros} onChange={e => setPros(e.target.value)} rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1 text-red-600">Cons</label>
              <textarea placeholder="One per line..." value={cons} onChange={e => setCons(e.target.value)} rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none" />
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Submitting…' : 'Submit Review for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage() {
  const [stats, setStats] = useState({ installs: 0, reviews: 0, plugins: 0, avgRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch popular plugins to calculate real stats
        const response = await getPopularPlugins('popular');
        const allPlugins = response.plugins || [];
        
        const totalInstalls = allPlugins.reduce((sum: number, p: any) => sum + (p.downloaded || 0), 0);
        const totalReviews = allPlugins.reduce((sum: number, p: any) => sum + (p.num_ratings || 0), 0);
        const avgRating = allPlugins.length > 0 
          ? allPlugins.reduce((sum: number, p: any) => sum + ((p.rating || 0) / 20), 0) / allPlugins.length 
          : 0;
        
        setStats({
          installs: totalInstalls,
          reviews: totalReviews,
          plugins: allPlugins.length,
          avgRating: avgRating
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback values
        setStats({ installs: 25000000, reviews: 75000, plugins: 22, avgRating: 4.6 });
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);
  
  const topPlugins = [...plugins].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const trendingPlugins = [...plugins].sort((a, b) => b.activeInstalls - a.activeInstalls).slice(0, 3);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B+';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString();
  };

  return (
    <div>
      <section className="relative bg-gradient-to-b from-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(174_76%_33%/0.08)_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
              <CheckCircle2 className="w-4 h-4" />
              Only Verified Reviews from Real WordPress Users
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight text-slate-900">
              Stop Trusting <span className="text-red-500">Fake</span> Plugin Reviews
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Every review on PluginTrust is verified against a real WordPress installation.
              Plus live analytics, security analysis, and fake review detection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none" />
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.querySelector('input') as HTMLInputElement;
                  if (input.value.trim()) {
                    navigate({ to: '/search', search: { q: input.value.trim() } });
                  }
                }}>
                  <input 
                    type="text" 
                    placeholder="Search any plugin (e.g. Yoast, Elementor)..."
                    className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl text-base shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all active:scale-95">
                    Analyze
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
            {statsLoading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 animate-pulse">
                    <div className="w-5 h-5 mx-auto mb-2 bg-slate-200 rounded" />
                    <div className="h-6 bg-slate-200 rounded w-16 mx-auto mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-20 mx-auto" />
                  </div>
                ))}
              </>
            ) : (
              [
                { icon: BarChart3, value: formatNumber(stats.installs), label: 'Installs Tracked', color: 'text-teal-600' },
                { icon: CheckCircle2, value: formatNumber(stats.reviews), label: 'Verified Reviews', color: 'text-teal-600' },
                { icon: Users, value: formatNumber(stats.plugins), label: 'Plugins Listed', color: 'text-teal-600' },
                { icon: Star, value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '4.6', label: 'Avg Trust Score', color: 'text-amber-500' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
            <Link to="/search" className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link key={cat.id} to="/category/$categoryId" params={{ categoryId: cat.id }}
                className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all text-center">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-medium text-sm group-hover:text-teal-600 transition-colors text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{cat.pluginCount} plugins</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Top Rated Plugins</h2>
            <Link to="/search" className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topPlugins.map(plugin => <PluginCard key={plugin.id} plugin={plugin} />)}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-7 text-slate-900">🔥 Trending by Active Installs</h2>
          <div className="space-y-3">
            {trendingPlugins.map((plugin, i) => (
              <Link key={plugin.id} to="/plugin/$pluginSlug" params={{ pluginSlug: plugin.slug }}
                className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-2xl font-bold text-slate-300 w-8 shrink-0">#{i + 1}</span>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                  {plugin.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-slate-900">{plugin.name}</p>
                  <p className="text-xs text-slate-500">{plugin.category} · {plugin.developer}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-teal-600">{formatNumber(plugin.activeInstalls)}</p>
                  <p className="text-xs text-slate-500">active installs</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-slate-900">{plugin.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">Why Choose PluginTrust?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Verified Reviews', desc: 'Every review is verified against real WordPress installations to ensure authenticity.' },
              { icon: Eye, title: 'Fake Review Detection', desc: 'Our AI identifies suspicious and fake reviews so you can trust what you read.' },
              { icon: BarChart3, title: 'Deep Analytics', desc: 'Track install trends, version distribution, and growth metrics for any plugin.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-r from-teal-600 to-teal-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Used a WordPress Plugin?</h2>
          <p className="text-white/80 mb-7">Your verified review helps thousands of WordPress users make smarter decisions.</p>
          <Link to="/search" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-600 font-semibold rounded-full hover:bg-white/95 transition-all shadow-lg hover:scale-105">
            Find a Plugin to Review
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── SEARCH PAGE ─────────────────────────────────────────────────────────────
function SearchPage() {
  const { q } = useSearch({ from: '/search' });
  const navigate = useNavigate();
  const [localQ, setLocalQ] = useState(q || '');
  const [sortBy, setSortBy] = useState<'rating' | 'installs' | 'reviews'>('rating');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResults, setApiResults] = useState<Plugin[]>([]);
  const [showApiResults, setShowApiResults] = useState(false);

  useEffect(() => {
    if (q) {
      setLocalQ(q);
      fetchFromAPI(q);
    } else {
      setApiResults([]);
      setShowApiResults(false);
    }
  }, [q]);

  const fetchFromAPI = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await searchWordPressPlugins(query);
      const transformed = response.plugins.slice(0, 24).map(transformWPPlugin);
      setApiResults(transformed as Plugin[]);
      setShowApiResults(true);
    } catch (error) {
      console.error('API fetch error:', error);
      toast.error('Failed to fetch from WordPress. Using local data.');
    } finally {
      setIsLoading(false);
    }
  };

  let localResults = q ? searchPlugins(q) : [...plugins];
  if (filterCategory !== 'all') localResults = localResults.filter(p => p.category === filterCategory);
  
  const sortPlugins = (list: Plugin[]) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'installs') return b.activeInstalls - a.activeInstalls;
      return b.reviewCount - a.reviewCount;
    });
  };

  const displayResults = showApiResults && apiResults.length > 0 
    ? sortPlugins(apiResults) 
    : sortPlugins(localResults);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: '/search', search: { q: localQ.trim() || undefined } });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {q ? `Search results for "${q}"` : 'Explore WordPress Plugins'}
            </h1>
            <p className="text-slate-500 mb-6">
              Access real-time analytics, verified reviews, and security insights for over 60,000 WordPress plugins.
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search by name, developer, or keyword..." 
                  value={localQ} 
                  onChange={e => setLocalQ(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                />
              </div>
              <button type="submit" className="px-8 py-3.5 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
              <div className="space-y-1">
                <button 
                  onClick={() => setFilterCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterCategory === 'all' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">{plugins.length}+</span>
                </button>
                {categories.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setFilterCategory(c.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterCategory === c.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{c.icon}</span>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sort By</h3>
              <div className="space-y-1">
                {[
                  { id: 'rating', label: 'Highest Rated', icon: Star },
                  { id: 'installs', label: 'Most Installs', icon: Download },
                  { id: 'reviews', label: 'Most Reviews', icon: ThumbsUp },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setSortBy(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${sortBy === item.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-bold text-slate-900">{displayResults.length}</span>
                <span>plugins found</span>
                {isLoading && (
                  <span className="flex items-center gap-2 ml-4 text-teal-600 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Searching WordPress.org...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">View:</span>
                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                  <button className="p-1.5 bg-slate-100 text-teal-600 rounded-md"><LayoutDashboard className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600"><Menu className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {isLoading && displayResults.length === 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 h-64 animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                      <div className="flex-1">
                        <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-full mb-6" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 bg-slate-50 rounded-xl" />
                      <div className="h-10 bg-slate-50 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayResults.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No plugins found</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  We couldn't find any plugins matching "{q}". Try checking for typos or using broader keywords.
                </p>
                <button 
                  onClick={() => { setLocalQ(''); setShowApiResults(false); navigate({ to: '/search' }); }}
                  className="px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayResults.map(plugin => <PluginCard key={plugin.id} plugin={plugin} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY PAGE ───────────────────────────────────────────────────────────
function CategoryPage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const category = categories.find(c => c.id === categoryId);
  const categoryPlugins = getPluginsByCategory(categoryId);
  const sortedPlugins = [...categoryPlugins].sort((a, b) => b.rating - a.rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <ChevronDown className="w-3 h-3 -rotate-90" />
        <span className="text-slate-900 font-medium">{category?.name || categoryId}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{category?.icon}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{category?.name || categoryId} Plugins</h1>
        </div>
        <p className="text-slate-600">{category?.description}</p>
        <p className="text-sm text-slate-500 mt-1">{sortedPlugins.length} plugins with verified reviews</p>
      </div>

      {sortedPlugins.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2 text-slate-900">No plugins in this category yet</h2>
          <Link to="/" className="text-teal-600 hover:underline">Back to home</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedPlugins.map(plugin => <PluginCard key={plugin.id} plugin={plugin} />)}
        </div>
      )}
    </div>
  );
}

// ─── PLUGIN DETAIL PAGE ───────────────────────────────────────────────────────
function PluginDetailPage() {
  const { pluginSlug } = useParams({ from: '/plugin/$pluginSlug' });
  const [plugin, setPlugin] = useState<Plugin | null>(getPluginBySlug(pluginSlug) || null);
  const [isLoading, setIsLoading] = useState(!plugin);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlugin() {
      if (plugin) return; // Already have local data

      setIsLoading(true);
      setError(null);
      try {
        const wpPlugin = await getWordPressPlugin(pluginSlug);
        if (wpPlugin) {
          setPlugin(transformWPPlugin(wpPlugin) as Plugin);
        } else {
          setError('Plugin not found in WordPress directory.');
        }
      } catch (err) {
        console.error('Failed to fetch plugin:', err);
        setError('Failed to connect to WordPress API.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPlugin();
  }, [pluginSlug]);

  const reviews = plugin ? getReviewsForPlugin(plugin.id) : [];
  const analytics = plugin ? getAnalyticsForPlugin(plugin.id) : null;
  const security = plugin ? (getSecurityAnalysis(plugin.id) || generateSecurityAnalysis(plugin)) : null;
  const fakeReviewAnalysis = plugin ? (getFakeReviewAnalysis(plugin.id) || generateFakeReviewAnalysis(plugin)) : null;
  const proData = plugin ? getProFeatureData(plugin.id) : null;
  const category = plugin ? categories.find(c => c.id === plugin.category) : null;
  const trustScore = plugin && security && fakeReviewAnalysis ? calculateTrustScore(plugin, security, fakeReviewAnalysis) : null;
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sortReviews, setSortReviews] = useState<'recent' | 'helpful'>('helpful');
  const [activeTab, setActiveTab] = useState<'reviews' | 'analytics' | 'security'>('reviews');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <RefreshCw className="w-12 h-12 mx-auto mb-4 text-teal-600 animate-spin" />
        <h2 className="text-xl font-semibold text-slate-900">Loading Plugin Data...</h2>
        <p className="text-slate-500 mt-2">Fetching the latest information from WordPress.org</p>
      </div>
    );
  }

  if (error || !plugin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-slate-900">{error || 'Plugin Not Found'}</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          We couldn't find the plugin you're looking for. It might be private or removed from the directory.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) =>
    sortReviews === 'helpful' ? b.helpfulCount - a.helpfulCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {showReviewModal && <ReviewModal plugin={plugin} onClose={() => setShowReviewModal(false)} />}

      <div className="bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link to="/" className="hover:text-teal-600 transition-colors">Directory</Link>
            <ChevronRight className="w-3 h-3" />
            {category && (
              <>
                <Link to="/category/$categoryId" params={{ categoryId: plugin.category }} className="hover:text-teal-600 transition-colors">
                  {category.name}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-slate-900 font-semibold truncate">{plugin.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center p-1 shrink-0">
                  {plugin.icon ? (
                    typeof plugin.icon === 'string' && plugin.icon.length > 2 ? (
                      <img src={plugin.icon} alt={plugin.name} className="w-full h-full object-contain rounded-2xl" />
                    ) : (
                      <span className="text-5xl">{plugin.icon}</span>
                    )
                  ) : (
                    <Shield className="w-12 h-12 text-teal-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black leading-tight text-slate-900 tracking-tight">{plugin.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                    <p className="text-slate-500 font-medium">by <span className="text-slate-900">{plugin.developer}</span></p>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                      <StarRating rating={plugin.rating} size="sm" />
                      <span className="font-bold text-sm">{plugin.rating.toFixed(1)}</span>
                      <span className="text-xs opacity-70">({plugin.reviewCount.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg border border-teal-100 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      {plugin.verifiedReviews.toLocaleString()} Verified Reviews
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-3xl">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">{plugin.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {(plugin.features || []).map(f => (
                    <span key={f} className="px-4 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-full border border-slate-200 shadow-sm uppercase tracking-wider">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href={plugin.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
                    <Star className="w-4 h-4 text-amber-500" /> Write a Review
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-80 space-y-6">
              {trustScore && (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-colors" />
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                      <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest">Trust Score</h3>
                      <p className="text-xs text-slate-400 mt-1">Reliability index</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 ${trustScore.grade.startsWith('A') ? 'bg-green-500 shadow-green-500/20' : trustScore.grade.startsWith('B') ? 'bg-teal-500 shadow-teal-500/20' : trustScore.grade.startsWith('C') ? 'bg-amber-500 shadow-amber-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                      <span className="text-white font-black text-xl">{trustScore.grade}</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 relative z-10 mb-6">
                    <span className="text-5xl font-black tracking-tighter">{trustScore.overallScore}</span>
                    <span className="text-slate-400 font-bold text-xl mb-1">/100</span>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${trustScore.grade.startsWith('A') ? 'bg-green-400' : 'bg-teal-400'}`} style={{ width: `${trustScore.overallScore}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                      Calculated from security, reviews, activity & popularity
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  Plugin Metrics
                </h3>
                <dl className="space-y-5">
                  {[
                    { label: 'Active Installs', value: formatNumber(plugin.activeInstalls), icon: Download },
                    { label: 'Version', value: plugin.version, icon: RefreshCw },
                    { label: 'Last Updated', value: formatDate(plugin.lastUpdated), icon: Activity },
                    { label: 'Price', value: plugin.price, highlight: plugin.price === 'Free', icon: Globe },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <dt className="text-slate-500 text-sm flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 opacity-50" />
                        {item.label}
                      </dt>
                      <dd className={`font-bold text-sm ${item.highlight ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded-md' : 'text-slate-900'}`}>
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'security', label: 'Security', icon: ShieldCheck },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'reviews' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Verified Reviews ({reviews.length})</h2>
                <select value={sortReviews} onChange={e => setSortReviews(e.target.value as typeof sortReviews)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white">
                  <option value="helpful">Most Helpful</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
              {sortedReviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">No reviews yet. Be the first to write one!</p>
                </div>
              ) : (
                sortedReviews.map(review => <ReviewCard key={review.id} review={review} />)
              )}
            </div>
            <div className="space-y-6">
              {fakeReviewAnalysis && <FakeReviewAnalysisCard analysis={fakeReviewAnalysis} />}
              {proData && <ProWebsitesCard data={proData} isPro={false} />}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <AnalyticsDashboard pluginId={plugin.id} />
            {proData && <ProWebsitesCard data={proData} isPro={false} />}
          </div>
        )}

        {activeTab === 'security' && security && (
          <div className="grid lg:grid-cols-2 gap-6">
            <SecurityScoreCard security={security} />
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-600" />
                How We Calculate Security Scores
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>Our security analysis considers multiple factors:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span><strong>Update Frequency</strong> - How often the plugin is updated with security patches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span><strong>Code Quality</strong> - Analysis of code structure and best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span><strong>Vulnerability History</strong> - Past security issues and how quickly they were fixed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span><strong>WordPress Compatibility</strong> - Tested with latest WordPress versions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span><strong>Support & Documentation</strong> - Quality of documentation and support response</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRICING PAGE ───────────────────────────────────────────────────────────────
function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Essential plugin insights for individual developers',
      features: [
        'Search all WordPress plugins',
        'View plugin ratings & reviews',
        'Basic security analysis',
        'Fake review detection',
        '5 plugin searches per day',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Advanced analytics for agencies & professionals',
      features: [
        'Everything in Free',
        'Unlimited plugin searches',
        'Website usage detection',
        'Historical analytics data',
        'Export reports (CSV)',
        'API access',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`relative bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-teal-500 shadow-xl' : 'border border-slate-200 shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'How do you verify reviews?', a: 'We verify reviews by checking if the reviewer has the plugin installed on their WordPress site through our site verification system.' },
              { q: 'What is the Trust Score?', a: 'The Trust Score is our proprietary algorithm that combines security analysis, review authenticity, update activity, and popularity to give you a single metric for plugin reliability.' },
              { q: 'How do you detect fake reviews?', a: 'Our AI analyzes patterns in reviews including timing, language patterns, reviewer history, and other signals to identify suspicious or fake reviews.' },
              { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay through our secure payment processor.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-slate-200">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-slate-900">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}