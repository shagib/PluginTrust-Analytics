export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  developer: string;
  website: string;
  lastUpdated: string;
  rating: number;
  reviewCount: number;
  verifiedReviews: number;
  activeInstalls: number;
  version: string;
  price: string;
  features: string[];
  icon: string;
}

export interface Review {
  id: string;
  pluginId: string;
  userName: string;
  userInitials: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  verifiedSite: string;
  helpfulCount: number;
  createdAt: string;
  pros: string[];
  cons: string[];
}

export interface PluginAnalytics {
  pluginId: string;
  activeInstalls: number;
  installsOverTime: { date: string; count: number }[];
  versionDistribution: { version: string; percentage: number }[];
  ratingBreakdown: { stars: number; count: number }[];
}

// Enhanced types for new features
export interface SecurityAnalysis {
  pluginId: string;
  overallScore: number;
  lastAudit: string;
  vulnerabilities: Vulnerability[];
  updateFrequency: 'high' | 'medium' | 'low';
  daysSinceUpdate: number;
  compatibilityScore: number;
  codeQualityScore: number;
  supportResponseTime: 'fast' | 'medium' | 'slow';
  factors: SecurityFactor[];
}

export interface SecurityFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface Vulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low';
  cve?: string;
  description: string;
  fixedIn?: string;
  publishedDate?: string;
}

export interface FakeReviewAnalysis {
  pluginId: string;
  totalReviews: number;
  realReviews: number;
  suspiciousReviews: number;
  fakeReviews: number;
  realPercentage: number;
  suspiciousPercentage: number;
  fakePercentage: number;
  sentimentAnalysis: SentimentAnalysis;
  flaggedReviews: FlaggedReview[];
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  avgSentimentScore: number;
}

export interface FlaggedReview {
  id: string;
  reason: string;
  confidence: number;
  indicators: string[];
  review?: Review;
}

export interface ProFeatureData {
  pluginId: string;
  websites: WebsiteData[];
}

export interface WebsiteData {
  domain: string;
  url: string;
  estimatedTraffic: 'low' | 'medium' | 'high' | 'very-high';
  country: string;
  techStack?: string[];
  detectedDate: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  pluginCount: number;
  description: string;
}

export const categories: Category[] = [
  { id: 'seo', name: 'SEO', icon: '🔍', pluginCount: 245, description: 'Optimize your site for search engines' },
  { id: 'security', name: 'Security', icon: '🛡️', pluginCount: 189, description: 'Protect your WordPress site' },
  { id: 'page-builders', name: 'Page Builders', icon: '🎨', pluginCount: 156, description: 'Design beautiful pages visually' },
  { id: 'performance', name: 'Performance', icon: '⚡', pluginCount: 134, description: 'Speed up your WordPress site' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒', pluginCount: 198, description: 'Sell products online with WordPress' },
  { id: 'analytics', name: 'Analytics', icon: '📊', pluginCount: 112, description: 'Track visits and user behavior' },
];

export const plugins: Plugin[] = [
  // SEO Plugins
  {
    id: 'yoast-seo',
    name: 'Yoast SEO',
    slug: 'yoast-seo',
    description: 'The first true all-in-one SEO solution for WordPress, including XML sitemaps, content analysis, readability checks, and structured data.',
    category: 'seo',
    developer: 'Team Yoast',
    website: 'https://yoast.com/wordpress/plugins/seo/',
    lastUpdated: '2026-03-08',
    rating: 4.7,
    reviewCount: 28450,
    verifiedReviews: 15234,
    activeInstalls: 10000000,
    version: '23.7',
    price: 'Free',
    icon: '🔍',
    features: ['XML Sitemaps', 'Content Analysis', 'Social Previews', 'Schema.org', 'Cornerstone Content', 'Redirects'],
  },
  {
    id: 'rank-math',
    name: 'Rank Math SEO',
    slug: 'rank-math',
    description: 'SEO plugin that helps you rank higher with 30+ tools including advanced analytics, AI features, and built-in schema markup.',
    category: 'seo',
    developer: 'Rank Math',
    website: 'https://rankmath.com/',
    lastUpdated: '2026-03-05',
    rating: 4.8,
    reviewCount: 18920,
    verifiedReviews: 12450,
    activeInstalls: 3200000,
    version: '1.0.215',
    price: 'Free',
    icon: '📈',
    features: ['Advanced Analytics', 'Schema Generator', 'Keyword Tracking', 'Position Tracker', 'Local SEO', 'AI-Powered'],
  },
  {
    id: 'all-in-one-seo',
    name: 'All in One SEO',
    slug: 'all-in-one-seo',
    description: 'The original SEO plugin for WordPress with powerful tools for search engine visibility, rich snippets, and social media sharing.',
    category: 'seo',
    developer: 'All in One SEO Team',
    website: 'https://aioseo.com/',
    lastUpdated: '2026-03-01',
    rating: 4.5,
    reviewCount: 15680,
    verifiedReviews: 8930,
    activeInstalls: 3000000,
    version: '4.7.2',
    price: 'Free',
    icon: '🔎',
    features: ['Smart Sitemaps', 'Rich Snippets', 'Local SEO', 'Image SEO', 'API Access', 'WooCommerce SEO'],
  },
  {
    id: 'seo-press',
    name: 'SEOPress',
    slug: 'seo-press',
    description: 'A powerful SEO plugin to optimize your WordPress site — no ads, unlimited sites, white label, and full Google Analytics integration.',
    category: 'seo',
    developer: 'SEOPress',
    website: 'https://seopress.org/',
    lastUpdated: '2026-02-28',
    rating: 4.6,
    reviewCount: 4230,
    verifiedReviews: 2156,
    activeInstalls: 450000,
    version: '7.8',
    price: 'Free',
    icon: '🧭',
    features: ['White Label', 'Structured Data', 'Google Analytics', 'WooCommerce', 'Breadcrumbs', 'Redirects'],
  },
  {
    id: 'squirrly-seo',
    name: 'Squirrly SEO',
    slug: 'squirrly-seo',
    description: 'SEO assistant with real-time optimization guidance, actionable insights, live preview, and automated publishing tools.',
    category: 'seo',
    developer: 'Squirrly',
    website: 'https://squirrly.co/',
    lastUpdated: '2026-02-20',
    rating: 4.3,
    reviewCount: 2890,
    verifiedReviews: 1234,
    activeInstalls: 180000,
    version: '5.1.5',
    price: 'Free',
    icon: '🐿️',
    features: ['Live SEO Audit', 'JSON-LD', 'Blogging SEO', 'Citation Building', 'SEO Automation', 'Keyword Research'],
  },
  // Security Plugins
  {
    id: 'wordfence',
    name: 'Wordfence Security',
    slug: 'wordfence',
    description: 'WordPress security plugin featuring a firewall, malware scanner, login security, and real-time threat defense feed.',
    category: 'security',
    developer: 'Wordfence',
    website: 'https://www.wordfence.com/',
    lastUpdated: '2026-03-07',
    rating: 4.8,
    reviewCount: 32100,
    verifiedReviews: 19800,
    activeInstalls: 5000000,
    version: '7.11.4',
    price: 'Free',
    icon: '🛡️',
    features: ['Web Application Firewall', 'Malware Scanner', '2FA', 'Login Security', 'IP Blocking', 'Live Traffic'],
  },
  {
    id: 'sucuri',
    name: 'Sucuri Security',
    slug: 'sucuri',
    description: 'Security auditing, malware scanning, and hardening plugin with activity monitoring, file integrity check, and blacklist monitoring.',
    category: 'security',
    developer: 'Sucuri Inc',
    website: 'https://sucuri.net/',
    lastUpdated: '2026-02-25',
    rating: 4.6,
    reviewCount: 11200,
    verifiedReviews: 7450,
    activeInstalls: 900000,
    version: '1.9.3',
    price: 'Free',
    icon: '🔒',
    features: ['Security Audit', 'File Integrity', 'Malware Scan', 'Blacklist Monitor', 'Hardening', 'Post-Hack'],
  },
  {
    id: 'ithemes-security',
    name: 'Solid Security',
    slug: 'ithemes-security',
    description: 'Formerly iThemes Security — 30+ ways to secure your WordPress site including brute force protection, database backups, and user logging.',
    category: 'security',
    developer: 'StellarWP',
    website: 'https://solidwp.com/security/',
    lastUpdated: '2026-02-22',
    rating: 4.5,
    reviewCount: 8900,
    verifiedReviews: 5200,
    activeInstalls: 1000000,
    version: '9.3.2',
    price: 'Free',
    icon: '🔐',
    features: ['Brute Force Protection', 'File Change Detection', '2FA', 'Strong Passwords', 'Database Backups', 'User Logging'],
  },
  {
    id: 'all-in-one-wp-security',
    name: 'All In One WP Security',
    slug: 'all-in-one-wp-security',
    description: 'Comprehensive security plugin with a visual security meter, firewall, login lockdown, user account security, and file system security.',
    category: 'security',
    developer: 'Tips and Tricks HQ',
    website: 'https://aiowpsecurity.com/',
    lastUpdated: '2026-02-18',
    rating: 4.4,
    reviewCount: 7640,
    verifiedReviews: 4100,
    activeInstalls: 1100000,
    version: '5.2.7',
    price: 'Free',
    icon: '🧱',
    features: ['Security Meter', 'Firewall', 'Login Lockdown', 'File System Security', 'SPAM Prevention', 'Scanner'],
  },
  // Page Builders
  {
    id: 'elementor',
    name: 'Elementor',
    slug: 'elementor',
    description: 'The most popular WordPress page builder plugin. Build stunning pages visually with drag-and-drop, 100+ widgets, and 300+ templates.',
    category: 'page-builders',
    developer: 'Elementor.com',
    website: 'https://elementor.com/',
    lastUpdated: '2026-03-06',
    rating: 4.7,
    reviewCount: 45200,
    verifiedReviews: 28900,
    activeInstalls: 12000000,
    version: '3.22.3',
    price: 'Free',
    icon: '🎨',
    features: ['Drag & Drop', '100+ Widgets', 'Theme Builder', 'Popup Builder', 'Dynamic Content', 'WooCommerce Builder'],
  },
  {
    id: 'divi',
    name: 'Divi Builder',
    slug: 'divi',
    description: 'Elegant Themes\' powerful visual page builder with a revolutionary visual editing experience and a library of 800+ pre-made layouts.',
    category: 'page-builders',
    developer: 'Elegant Themes',
    website: 'https://www.elegantthemes.com/gallery/divi/',
    lastUpdated: '2026-03-02',
    rating: 4.6,
    reviewCount: 18700,
    verifiedReviews: 12300,
    activeInstalls: 700000,
    version: '4.24.2',
    price: '$89/year',
    icon: '✏️',
    features: ['Visual Builder', '800+ Layouts', 'Split Testing', 'Global Elements', 'Custom CSS', 'Responsive Editing'],
  },
  {
    id: 'beaver-builder',
    name: 'Beaver Builder',
    slug: 'beaver-builder',
    description: 'A flexible drag-and-drop page builder with a clean interface, developer-friendly features, and strong performance record.',
    category: 'page-builders',
    developer: 'Fastline Media LLC',
    website: 'https://www.wpbeaverbuilder.com/',
    lastUpdated: '2026-02-27',
    rating: 4.7,
    reviewCount: 9800,
    verifiedReviews: 6700,
    activeInstalls: 400000,
    version: '2.8.3',
    price: 'Free',
    icon: '🦫',
    features: ['Drag & Drop', 'Row/Column Layouts', 'Saved Layouts', 'Developer Friendly', 'White Label', 'WooCommerce'],
  },
  {
    id: 'bricks',
    name: 'Bricks Builder',
    slug: 'bricks',
    description: 'A theme and page builder hybrid that gives developers full control. Ultra-fast, code-free visual site building for WordPress.',
    category: 'page-builders',
    developer: 'Bricks',
    website: 'https://bricksbuilder.io/',
    lastUpdated: '2026-03-01',
    rating: 4.9,
    reviewCount: 4200,
    verifiedReviews: 3100,
    activeInstalls: 95000,
    version: '1.10.3',
    price: '$79/year',
    icon: '🧩',
    features: ['Theme Builder', 'Query Loop', 'Dynamic Data', 'Custom CSS', 'Developer Mode', 'No Bloat'],
  },
  // Performance Plugins
  {
    id: 'wp-rocket',
    name: 'WP Rocket',
    slug: 'wp-rocket',
    description: 'The most powerful WordPress caching plugin. Page caching, file optimization, media optimization, and CDN integration.',
    category: 'performance',
    developer: 'WP Media',
    website: 'https://wp-rocket.me/',
    lastUpdated: '2026-03-04',
    rating: 4.9,
    reviewCount: 22400,
    verifiedReviews: 16800,
    activeInstalls: 3500000,
    version: '3.16.2',
    price: '$59/year',
    icon: '🚀',
    features: ['Page Caching', 'File Minification', 'Lazy Loading', 'Database Optimization', 'CDN Integration', 'Heartbeat Control'],
  },
  {
    id: 'litespeed-cache',
    name: 'LiteSpeed Cache',
    slug: 'litespeed-cache',
    description: 'All-in-one site acceleration plugin with exclusive server-level cache and optimization tools for images, CSS, JS, and database.',
    category: 'performance',
    developer: 'LiteSpeed Technologies',
    website: 'https://www.litespeedtech.com/products/cache-plugins/wordpress-acceleration',
    lastUpdated: '2026-03-03',
    rating: 4.7,
    reviewCount: 19600,
    verifiedReviews: 13200,
    activeInstalls: 6000000,
    version: '6.3',
    price: 'Free',
    icon: '⚡',
    features: ['Server-Level Cache', 'Image Optimization', 'Object Cache', 'Database Cleaner', 'CDN', 'Page Optimization'],
  },
  {
    id: 'w3-total-cache',
    name: 'W3 Total Cache',
    slug: 'w3-total-cache',
    description: 'Proven WordPress performance optimization framework. Improve search rankings, conversion rates and website performance.',
    category: 'performance',
    developer: 'BoldGrid',
    website: 'https://www.boldgrid.com/w3-total-cache/',
    lastUpdated: '2026-02-26',
    rating: 4.2,
    reviewCount: 14800,
    verifiedReviews: 8900,
    activeInstalls: 1000000,
    version: '2.7.5',
    price: 'Free',
    icon: '💨',
    features: ['Page Cache', 'DB Cache', 'Object Cache', 'Browser Cache', 'CDN', 'Minify CSS/JS'],
  },
  {
    id: 'imagify',
    name: 'Imagify',
    slug: 'imagify',
    description: 'Automatically compress and optimize your images in WebP format. Reduce file size by up to 80% without quality loss.',
    category: 'performance',
    developer: 'WP Media',
    website: 'https://imagify.io/',
    lastUpdated: '2026-02-24',
    rating: 4.7,
    reviewCount: 8200,
    verifiedReviews: 5600,
    activeInstalls: 800000,
    version: '2.2.3',
    price: 'Free',
    icon: '🖼️',
    features: ['WebP Conversion', 'Bulk Optimization', 'Lazy Loading', 'CDN Ready', 'WooCommerce', 'Multisite'],
  },
  // E-commerce Plugins
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    slug: 'woocommerce',
    description: 'The world\'s most popular open-source eCommerce solution. Sell anything, anywhere. Built on WordPress for flexibility and scale.',
    category: 'ecommerce',
    developer: 'Automattic',
    website: 'https://woocommerce.com/',
    lastUpdated: '2026-03-06',
    rating: 4.5,
    reviewCount: 89200,
    verifiedReviews: 54300,
    activeInstalls: 7000000,
    version: '9.4.2',
    price: 'Free',
    icon: '🛒',
    features: ['Product Management', 'Payment Gateways', 'Inventory Management', 'Tax Calculation', 'Shipping', 'Analytics'],
  },
  {
    id: 'easy-digital-downloads',
    name: 'Easy Digital Downloads',
    slug: 'easy-digital-downloads',
    description: 'Sell digital products, software, eBooks, art, music, and more with a beautiful checkout experience built for digital goods.',
    category: 'ecommerce',
    developer: 'Sandhills Development',
    website: 'https://easydigitaldownloads.com/',
    lastUpdated: '2026-02-28',
    rating: 4.7,
    reviewCount: 12400,
    verifiedReviews: 8900,
    activeInstalls: 600000,
    version: '3.3.4',
    price: 'Free',
    icon: '💾',
    features: ['Digital Downloads', 'License Keys', 'Subscription Payments', 'Analytics', 'Discount Codes', 'Customer Management'],
  },
  {
    id: 'give-wp',
    name: 'GiveWP',
    slug: 'give-wp',
    description: 'The most robust donation plugin built for WordPress. Powerful donation forms, payment gateways, donor management, and reporting.',
    category: 'ecommerce',
    developer: 'GiveWP',
    website: 'https://givewp.com/',
    lastUpdated: '2026-02-22',
    rating: 4.8,
    reviewCount: 6700,
    verifiedReviews: 4800,
    activeInstalls: 120000,
    version: '3.16.1',
    price: 'Free',
    icon: '🎁',
    features: ['Donation Forms', 'Recurring Donations', 'Donor Management', 'Reporting', 'Multiple Gateways', 'Campaign Goals'],
  },
  // Analytics Plugins
  {
    id: 'monsterinsights',
    name: 'MonsterInsights',
    slug: 'monsterinsights',
    description: 'The #1 Google Analytics plugin for WordPress. Connect GA4, view real-time stats, and get actionable insights right inside WordPress.',
    category: 'analytics',
    developer: 'MonsterInsights',
    website: 'https://www.monsterinsights.com/',
    lastUpdated: '2026-03-05',
    rating: 4.6,
    reviewCount: 16800,
    verifiedReviews: 11200,
    activeInstalls: 3000000,
    version: '8.33.0',
    price: 'Free',
    icon: '📊',
    features: ['GA4 Integration', 'Real-Time Stats', 'eCommerce Tracking', 'Form Tracking', 'Custom Dimensions', 'Page Insights'],
  },
  {
    id: 'exactmetrics',
    name: 'ExactMetrics',
    slug: 'exactmetrics',
    description: 'Premium Google Analytics plugin for WordPress with enhanced eCommerce reporting, custom dimensions, events, and more.',
    category: 'analytics',
    developer: 'ExactMetrics',
    website: 'https://www.exactmetrics.com/',
    lastUpdated: '2026-02-27',
    rating: 4.5,
    reviewCount: 5600,
    verifiedReviews: 3800,
    activeInstalls: 700000,
    version: '8.12.0',
    price: 'Free',
    icon: '📉',
    features: ['GA4 Dashboard', 'eCommerce Reports', 'Custom Dimensions', 'Events Tracking', 'User Journey', 'Real-Time'],
  },
  {
    id: 'independent-analytics',
    name: 'Independent Analytics',
    slug: 'independent-analytics',
    description: 'A privacy-first analytics plugin built into WordPress. No third-party scripts, no cookies, GDPR compliant by design.',
    category: 'analytics',
    developer: 'IdeaBox Creations',
    website: 'https://independentwp.com/',
    lastUpdated: '2026-02-20',
    rating: 4.8,
    reviewCount: 890,
    verifiedReviews: 640,
    activeInstalls: 40000,
    version: '2.1.0',
    price: 'Free',
    icon: '🔒',
    features: ['Privacy-First', 'No Cookies', 'GDPR Compliant', 'Real-Time', 'Referrer Tracking', 'Device Stats'],
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    pluginId: 'yoast-seo',
    userName: 'Sarah Mitchell',
    userInitials: 'SM',
    rating: 5,
    title: 'Essential for any WordPress site',
    content: 'I have been using Yoast for 5 years across 50+ client sites. The content analysis and schema features are unmatched. The recent updates have made it even better with improved AI integration.',
    verified: true,
    verifiedSite: 'mitchellwebdesign.com',
    helpfulCount: 234,
    createdAt: '2026-03-05',
    pros: ['Easy to use', 'Comprehensive features', 'Great support'],
    cons: ['Some features require premium'],
  },
  {
    id: 'rev-2',
    pluginId: 'yoast-seo',
    userName: 'James Chen',
    userInitials: 'JC',
    rating: 4,
    title: 'Solid SEO foundation',
    content: 'Good plugin overall. The readability check is helpful but sometimes too strict. XML sitemaps work perfectly and the Google Search Console integration is very useful.',
    verified: true,
    verifiedSite: 'chenwebstudio.com',
    helpfulCount: 89,
    createdAt: '2026-03-01',
    pros: ['XML sitemaps', 'GSC integration'],
    cons: ['Aggressive premium upsells'],
  },
  {
    id: 'rev-3',
    pluginId: 'rank-math',
    userName: 'Emma Rodriguez',
    userInitials: 'ER',
    rating: 5,
    title: 'Game changer for SEO',
    content: 'Switched from Yoast to Rank Math and never looked back. The built-in analytics and schema features save me money on other tools. The free version does what Yoast charges for.',
    verified: true,
    verifiedSite: 'rodriguezmarketing.io',
    helpfulCount: 312,
    createdAt: '2026-03-07',
    pros: ['Free version is feature-rich', 'Great analytics', 'Easy migration'],
    cons: ['Dashboard can be overwhelming'],
  },
  {
    id: 'rev-4',
    pluginId: 'rank-math',
    userName: 'Michael Park',
    userInitials: 'MP',
    rating: 5,
    title: 'Best SEO plugin I have used',
    content: 'The AI features are impressive. The schema wizard makes it easy to add structured data to every page. Keyword tracking is excellent too.',
    verified: true,
    verifiedSite: 'parkcreative.co',
    helpfulCount: 156,
    createdAt: '2026-02-28',
    pros: ['AI features', 'Schema wizard', 'Speed'],
    cons: ['None so far'],
  },
  {
    id: 'rev-5',
    pluginId: 'wordfence',
    userName: 'David Nguyen',
    userInitials: 'DN',
    rating: 5,
    title: 'Saved my site multiple times',
    content: 'The firewall blocked over 500 attack attempts in the first month. The malware scanner caught a compromised file that my host missed. Wordfence is non-negotiable for any serious WordPress site.',
    verified: true,
    verifiedSite: 'nguyenecommerce.com',
    helpfulCount: 489,
    createdAt: '2026-03-06',
    pros: ['Excellent firewall', 'Real-time threat data', 'Email alerts'],
    cons: ['Can slow shared hosting'],
  },
  {
    id: 'rev-6',
    pluginId: 'wordfence',
    userName: 'Lisa Thompson',
    userInitials: 'LT',
    rating: 4,
    title: 'Reliable and comprehensive',
    content: 'Been using Wordfence for 3 years across 20+ client sites. Very reliable. The two-factor authentication is easy to set up for clients.',
    verified: true,
    verifiedSite: 'thompsonconsulting.net',
    helpfulCount: 134,
    createdAt: '2026-02-20',
    pros: ['Comprehensive protection', '2FA', 'Good dashboard'],
    cons: ['Premium pricing is steep'],
  },
  {
    id: 'rev-7',
    pluginId: 'elementor',
    userName: 'Alex Rivera',
    userInitials: 'AR',
    rating: 5,
    title: 'Transformed my web design workflow',
    content: 'Elementor is the reason I can deliver 5 client sites a month solo. The template library is huge, the popup builder saves me from needing extra plugins.',
    verified: true,
    verifiedSite: 'alexriveradesign.com',
    helpfulCount: 678,
    createdAt: '2026-03-04',
    pros: ['Huge template library', 'Popup builder included', 'Fast workflow'],
    cons: ['Can be heavy on resources'],
  },
  {
    id: 'rev-8',
    pluginId: 'wp-rocket',
    userName: 'Chris Wang',
    userInitials: 'CW',
    rating: 5,
    title: 'GTmetrix went from D to A overnight',
    content: 'Installed WP Rocket and my site went from 78 to 97 on Google PageSpeed in 20 minutes. Worth every penny of the subscription.',
    verified: true,
    verifiedSite: 'wangdigital.net',
    helpfulCount: 567,
    createdAt: '2026-03-03',
    pros: ['Instant performance gains', 'Easy setup', 'Great support'],
    cons: ['Pricey for multiple sites'],
  },
  {
    id: 'rev-9',
    pluginId: 'woocommerce',
    userName: 'Nina Patel',
    userInitials: 'NP',
    rating: 4,
    title: 'Powerful but needs maintenance',
    content: 'Running a $2M/year store on WooCommerce. It handles everything we need. Just be prepared to manage updates carefully and invest in good hosting.',
    verified: true,
    verifiedSite: 'patelboutique.store',
    helpfulCount: 892,
    createdAt: '2026-03-01',
    pros: ['Unlimited customization', 'Huge extension ecosystem', 'Scales well'],
    cons: ['Can get slow with many plugins', 'Updates need careful management'],
  },
  {
    id: 'rev-10',
    pluginId: 'monsterinsights',
    userName: 'Tom Bradley',
    userInitials: 'TB',
    rating: 4,
    title: 'Makes GA4 actually usable',
    content: 'GA4 alone is confusing. MonsterInsights presents the data in a way that makes sense for WordPress site owners. The eCommerce reports are especially valuable.',
    verified: true,
    verifiedSite: 'bradleyconsulting.biz',
    helpfulCount: 203,
    createdAt: '2026-02-25',
    pros: ['Clear GA4 reporting', 'eCommerce tracking', 'Form tracking'],
    cons: ['Best features behind paywall'],
  },
];

export const pluginAnalytics: Record<string, PluginAnalytics> = {
  'yoast-seo': {
    pluginId: 'yoast-seo',
    activeInstalls: 10000000,
    installsOverTime: [
      { date: 'Jul 25', count: 8200000 },
      { date: 'Aug 25', count: 8550000 },
      { date: 'Sep 25', count: 8820000 },
      { date: 'Oct 25', count: 9100000 },
      { date: 'Nov 25', count: 9400000 },
      { date: 'Dec 25', count: 9600000 },
      { date: 'Jan 26', count: 9800000 },
      { date: 'Feb 26', count: 10000000 },
    ],
    versionDistribution: [
      { version: '23.x (latest)', percentage: 48 },
      { version: '22.x', percentage: 27 },
      { version: '21.x', percentage: 13 },
      { version: '20.x', percentage: 8 },
      { version: 'Older', percentage: 4 },
    ],
    ratingBreakdown: [
      { stars: 5, count: 18500 },
      { stars: 4, count: 6200 },
      { stars: 3, count: 2100 },
      { stars: 2, count: 950 },
      { stars: 1, count: 700 },
    ],
  },
  'rank-math': {
    pluginId: 'rank-math',
    activeInstalls: 3200000,
    installsOverTime: [
      { date: 'Jul 25', count: 1800000 },
      { date: 'Aug 25', count: 2100000 },
      { date: 'Sep 25', count: 2400000 },
      { date: 'Oct 25', count: 2650000 },
      { date: 'Nov 25', count: 2850000 },
      { date: 'Dec 25', count: 3000000 },
      { date: 'Jan 26', count: 3100000 },
      { date: 'Feb 26', count: 3200000 },
    ],
    versionDistribution: [
      { version: '1.0.215 (latest)', percentage: 60 },
      { version: '1.0.2xx', percentage: 25 },
      { version: '1.0.1xx', percentage: 12 },
      { version: 'Older', percentage: 3 },
    ],
    ratingBreakdown: [
      { stars: 5, count: 12500 },
      { stars: 4, count: 4200 },
      { stars: 3, count: 1400 },
      { stars: 2, count: 520 },
      { stars: 1, count: 300 },
    ],
  },
  'wordfence': {
    pluginId: 'wordfence',
    activeInstalls: 5000000,
    installsOverTime: [
      { date: 'Jul 25', count: 4200000 },
      { date: 'Aug 25', count: 4350000 },
      { date: 'Sep 25', count: 4480000 },
      { date: 'Oct 25', count: 4600000 },
      { date: 'Nov 25', count: 4720000 },
      { date: 'Dec 25', count: 4830000 },
      { date: 'Jan 26', count: 4920000 },
      { date: 'Feb 26', count: 5000000 },
    ],
    versionDistribution: [
      { version: '7.11.x (latest)', percentage: 55 },
      { version: '7.10.x', percentage: 28 },
      { version: '7.9.x', percentage: 12 },
      { version: 'Older', percentage: 5 },
    ],
    ratingBreakdown: [
      { stars: 5, count: 22100 },
      { stars: 4, count: 6800 },
      { stars: 3, count: 1900 },
      { stars: 2, count: 800 },
      { stars: 1, count: 500 },
    ],
  },
  'elementor': {
    pluginId: 'elementor',
    activeInstalls: 12000000,
    installsOverTime: [
      { date: 'Jul 25', count: 10200000 },
      { date: 'Aug 25', count: 10600000 },
      { date: 'Sep 25', count: 10900000 },
      { date: 'Oct 25', count: 11200000 },
      { date: 'Nov 25', count: 11500000 },
      { date: 'Dec 25', count: 11700000 },
      { date: 'Jan 26', count: 11900000 },
      { date: 'Feb 26', count: 12000000 },
    ],
    versionDistribution: [
      { version: '3.22.x (latest)', percentage: 52 },
      { version: '3.21.x', percentage: 24 },
      { version: '3.20.x', percentage: 14 },
      { version: 'Older', percentage: 10 },
    ],
    ratingBreakdown: [
      { stars: 5, count: 30200 },
      { stars: 4, count: 9800 },
      { stars: 3, count: 3100 },
      { stars: 2, count: 1200 },
      { stars: 1, count: 900 },
    ],
  },
  'wp-rocket': {
    pluginId: 'wp-rocket',
    activeInstalls: 3500000,
    installsOverTime: [
      { date: 'Jul 25', count: 2600000 },
      { date: 'Aug 25', count: 2800000 },
      { date: 'Sep 25', count: 2950000 },
      { date: 'Oct 25', count: 3100000 },
      { date: 'Nov 25', count: 3200000 },
      { date: 'Dec 25', count: 3300000 },
      { date: 'Jan 26', count: 3420000 },
      { date: 'Feb 26', count: 3500000 },
    ],
    versionDistribution: [
      { version: '3.16.x (latest)', percentage: 62 },
      { version: '3.15.x', percentage: 24 },
      { version: '3.14.x', percentage: 10 },
      { version: 'Older', percentage: 4 },
    ],
    ratingBreakdown: [
      { stars: 5, count: 18900 },
      { stars: 4, count: 2800 },
      { stars: 3, count: 600 },
      { stars: 2, count: 60 },
      { stars: 1, count: 40 },
    ],
  },
};

// Helper functions
export function getPluginBySlug(slug: string): Plugin | undefined {
  return plugins.find(p => p.slug === slug);
}

export function getReviewsForPlugin(pluginId: string): Review[] {
  return reviews.filter(r => r.pluginId === pluginId);
}

export function getAnalyticsForPlugin(pluginId: string): PluginAnalytics | undefined {
  return pluginAnalytics[pluginId];
}

export function getPluginsByCategory(category: string): Plugin[] {
  return plugins.filter(p => p.category === category);
}

export function searchPlugins(query: string): Plugin[] {
  const lowerQuery = query.toLowerCase();
  return plugins.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.developer.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
  return num.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Security Analysis Data
export const securityAnalyses: Record<string, SecurityAnalysis> = {
  'yoast-seo': {
    pluginId: 'yoast-seo',
    overallScore: 92,
    lastAudit: '2026-03-01',
    vulnerabilities: [],
    updateFrequency: 'high',
    daysSinceUpdate: 3,
    compatibilityScore: 98,
    codeQualityScore: 94,
    supportResponseTime: 'fast',
    factors: [
      { name: 'Update Frequency', score: 95, weight: 0.25, description: 'Regular updates with security patches' },
      { name: 'Code Quality', score: 94, weight: 0.20, description: 'Clean, well-maintained codebase' },
      { name: 'Vulnerability History', score: 98, weight: 0.25, description: 'Few critical vulnerabilities, quick fixes' },
      { name: 'WordPress Compatibility', score: 98, weight: 0.15, description: 'Always compatible with latest WP' },
      { name: 'Support & Documentation', score: 88, weight: 0.15, description: 'Excellent docs and support channels' },
    ],
  },
  'rank-math': {
    pluginId: 'rank-math',
    overallScore: 89,
    lastAudit: '2026-02-28',
    vulnerabilities: [],
    updateFrequency: 'high',
    daysSinceUpdate: 6,
    compatibilityScore: 95,
    codeQualityScore: 90,
    supportResponseTime: 'fast',
    factors: [
      { name: 'Update Frequency', score: 92, weight: 0.25, description: 'Frequent updates with new features' },
      { name: 'Code Quality', score: 88, weight: 0.20, description: 'Good code structure, some bloat' },
      { name: 'Vulnerability History', score: 92, weight: 0.25, description: 'Minor issues found, quick resolution' },
      { name: 'WordPress Compatibility', score: 95, weight: 0.15, description: 'Strong WP compatibility' },
      { name: 'Support & Documentation', score: 85, weight: 0.15, description: 'Active community support' },
    ],
  },
  'wordfence': {
    pluginId: 'wordfence',
    overallScore: 95,
    lastAudit: '2026-03-05',
    vulnerabilities: [],
    updateFrequency: 'high',
    daysSinceUpdate: 4,
    compatibilityScore: 97,
    codeQualityScore: 96,
    supportResponseTime: 'fast',
    factors: [
      { name: 'Update Frequency', score: 98, weight: 0.25, description: 'Very frequent security updates' },
      { name: 'Code Quality', score: 96, weight: 0.20, description: 'Enterprise-grade security code' },
      { name: 'Vulnerability History', score: 99, weight: 0.25, description: 'Excellent security track record' },
      { name: 'WordPress Compatibility', score: 97, weight: 0.15, description: 'Always up-to-date with WP' },
      { name: 'Support & Documentation', score: 90, weight: 0.15, description: 'Premium support available' },
    ],
  },
  'elementor': {
    pluginId: 'elementor',
    overallScore: 85,
    lastAudit: '2026-03-02',
    vulnerabilities: [
      { severity: 'medium', description: 'XSS vulnerability in popup builder', fixedIn: '3.22.0', publishedDate: '2026-01-15' },
    ],
    updateFrequency: 'high',
    daysSinceUpdate: 5,
    compatibilityScore: 90,
    codeQualityScore: 82,
    supportResponseTime: 'medium',
    factors: [
      { name: 'Update Frequency', score: 90, weight: 0.25, description: 'Regular updates' },
      { name: 'Code Quality', score: 78, weight: 0.20, description: 'Large codebase, some performance issues' },
      { name: 'Vulnerability History', score: 85, weight: 0.25, description: 'Some vulnerabilities found historically' },
      { name: 'WordPress Compatibility', score: 90, weight: 0.15, description: 'Good compatibility track record' },
      { name: 'Support & Documentation', score: 88, weight: 0.15, description: 'Large community and docs' },
    ],
  },
  'wp-rocket': {
    pluginId: 'wp-rocket',
    overallScore: 91,
    lastAudit: '2026-03-03',
    vulnerabilities: [],
    updateFrequency: 'medium',
    daysSinceUpdate: 7,
    compatibilityScore: 96,
    codeQualityScore: 92,
    supportResponseTime: 'fast',
    factors: [
      { name: 'Update Frequency', score: 85, weight: 0.25, description: 'Steady update pace' },
      { name: 'Code Quality', score: 94, weight: 0.20, description: 'Well-optimized performance code' },
      { name: 'Vulnerability History', score: 96, weight: 0.25, description: 'Very few security issues' },
      { name: 'WordPress Compatibility', score: 96, weight: 0.15, description: 'Excellent compatibility' },
      { name: 'Support & Documentation', score: 90, weight: 0.15, description: 'Fast support response' },
    ],
  },
};

// Fake Review Analysis Data
export const fakeReviewAnalyses: Record<string, FakeReviewAnalysis> = {
  'yoast-seo': {
    pluginId: 'yoast-seo',
    totalReviews: 28450,
    realReviews: 24200,
    suspiciousReviews: 3200,
    fakeReviews: 1050,
    realPercentage: 85,
    suspiciousPercentage: 11,
    fakePercentage: 4,
    sentimentAnalysis: { positive: 72, neutral: 18, negative: 10, avgSentimentScore: 0.65 },
    flaggedReviews: [
      { id: 'flag-1', reason: 'Generic language patterns', confidence: 78, indicators: ['Uses generic praise phrases', 'No specific plugin features mentioned'] },
      { id: 'flag-2', reason: 'Unrealistic timeline', confidence: 65, indicators: ['Claims years of use without details'] },
    ],
  },
  'rank-math': {
    pluginId: 'rank-math',
    totalReviews: 18920,
    realReviews: 16200,
    suspiciousReviews: 2100,
    fakeReviews: 620,
    realPercentage: 86,
    suspiciousPercentage: 11,
    fakePercentage: 3,
    sentimentAnalysis: { positive: 78, neutral: 15, negative: 7, avgSentimentScore: 0.71 },
    flaggedReviews: [
      { id: 'flag-1', reason: ' promotional language', confidence: 72, indicators: ['Sounds like marketing copy'] },
    ],
  },
  'wordfence': {
    pluginId: 'wordfence',
    totalReviews: 32100,
    realReviews: 28900,
    suspiciousReviews: 2400,
    fakeReviews: 800,
    realPercentage: 90,
    suspiciousPercentage: 7,
    fakePercentage: 3,
    sentimentAnalysis: { positive: 75, neutral: 17, negative: 8, avgSentimentScore: 0.67 },
    flaggedReviews: [],
  },
  'elementor': {
    pluginId: 'elementor',
    totalReviews: 45200,
    realReviews: 36200,
    suspiciousReviews: 6800,
    fakeReviews: 2200,
    realPercentage: 80,
    suspiciousPercentage: 15,
    fakePercentage: 5,
    sentimentAnalysis: { positive: 68, neutral: 20, negative: 12, avgSentimentScore: 0.56 },
    flaggedReviews: [
      { id: 'flag-1', reason: 'Suspiciously positive', confidence: 85, indicators: ['5-star ratings with no cons', 'Generic praise only'] },
      { id: 'flag-2', reason: 'Copy-paste patterns', confidence: 80, indicators: ['Similar phrases across multiple reviews'] },
      { id: 'flag-3', reason: 'New accounts with 5-star', confidence: 70, indicators: ['Recent accounts only reviewing this plugin'] },
    ],
  },
  'wp-rocket': {
    pluginId: 'wp-rocket',
    totalReviews: 22400,
    realReviews: 20600,
    suspiciousReviews: 1400,
    fakeReviews: 400,
    realPercentage: 92,
    suspiciousPercentage: 6,
    fakePercentage: 2,
    sentimentAnalysis: { positive: 82, neutral: 13, negative: 5, avgSentimentScore: 0.77 },
    flaggedReviews: [],
  },
};

// Pro Feature Data - websites using each plugin
export const proFeatureData: Record<string, ProFeatureData> = {
  'yoast-seo': {
    pluginId: 'yoast-seo',
    websites: [
      { domain: 'techcrunch.com', url: 'https://techcrunch.com', estimatedTraffic: 'very-high', country: 'United States', techStack: ['WordPress 6.4', 'PHP 8.2', 'Nginx'], detectedDate: '2026-02-15' },
      { domain: 'Variety.com', url: 'https://variety.com', estimatedTraffic: 'very-high', country: 'United States', techStack: ['WordPress 6.3', 'PHP 8.1'], detectedDate: '2026-02-10' },
      { domain: 'Sony.com', url: 'https://sony.com', estimatedTraffic: 'very-high', country: 'Japan', techStack: ['WordPress 6.4', 'Apache'], detectedDate: '2026-01-20' },
      { domain: 'BMW.com', url: 'https://bmw.com', estimatedTraffic: 'very-high', country: 'Germany', techStack: ['WordPress 6.3', 'PHP 8.0'], detectedDate: '2026-02-01' },
      { domain: 'Newsweek.com', url: 'https://newsweek.com', estimatedTraffic: 'very-high', country: 'United States', techStack: ['WordPress 6.4', 'PHP 8.2'], detectedDate: '2026-02-20' },
    ],
  },
  'elementor': {
    pluginId: 'elementor',
    websites: [
      { domain: 'wework.com', url: 'https://wework.com', estimatedTraffic: 'very-high', country: 'United States', techStack: ['WordPress 6.4', 'PHP 8.2', 'Elementor Pro'], detectedDate: '2026-02-18' },
      { domain: 'studiopress.com', url: 'https://studiopress.com', estimatedTraffic: 'high', country: 'United States', techStack: ['WordPress 6.3', 'Elementor'], detectedDate: '2026-02-12' },
      { domain: 'dreamhost.com', url: 'https://dreamhost.com', estimatedTraffic: 'high', country: 'United States', techStack: ['WordPress 6.4', 'PHP 8.1'], detectedDate: '2026-02-08' },
    ],
  },
};

// Helper functions for new features
export function getSecurityAnalysis(pluginId: string): SecurityAnalysis | undefined {
  return securityAnalyses[pluginId];
}

export function getFakeReviewAnalysis(pluginId: string): FakeReviewAnalysis | undefined {
  return fakeReviewAnalyses[pluginId];
}

export function getProFeatureData(pluginId: string): ProFeatureData | undefined {
  return proFeatureData[pluginId];
}

// Generate security analysis for plugins not in our database
export function generateSecurityAnalysis(plugin: Partial<Plugin>): SecurityAnalysis {
  const daysSinceUpdate = plugin.lastUpdated ? Math.floor((Date.now() - new Date(plugin.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)) : 30;
  const updateScore = daysSinceUpdate < 7 ? 95 : daysSinceUpdate < 30 ? 80 : daysSinceUpdate < 90 ? 60 : 40;
  
  return {
    pluginId: plugin.id || '',
    overallScore: Math.min(95, 60 + (updateScore / 100) * 35),
    lastAudit: new Date().toISOString().split('T')[0],
    vulnerabilities: [],
    updateFrequency: daysSinceUpdate < 14 ? 'high' : daysSinceUpdate < 60 ? 'medium' : 'low',
    daysSinceUpdate,
    compatibilityScore: 90,
    codeQualityScore: 75,
    supportResponseTime: 'medium',
    factors: [
      { name: 'Update Frequency', score: updateScore, weight: 0.25, description: daysSinceUpdate < 7 ? 'Recently updated' : `${daysSinceUpdate} days since last update` },
      { name: 'Code Quality', score: 75, weight: 0.20, description: 'Standard WordPress plugin code quality' },
      { name: 'Vulnerability History', score: 85, weight: 0.25, description: 'Unknown - not in our database' },
      { name: 'WordPress Compatibility', score: 90, weight: 0.15, description: 'Compatible with major WP versions' },
      { name: 'Support & Documentation', score: 80, weight: 0.15, description: 'WordPress.org support forums' },
    ],
  };
}

// Generate fake review analysis for plugins not in our database
export function generateFakeReviewAnalysis(plugin: Partial<Plugin>): FakeReviewAnalysis {
  const reviewCount = plugin.reviewCount || 100;
  const realPercentage = reviewCount > 10000 ? 82 : reviewCount > 1000 ? 75 : 70;
  const fakePercentage = reviewCount > 10000 ? 3 : reviewCount > 1000 ? 5 : 8;
  const suspiciousPercentage = 100 - realPercentage - fakePercentage;
  
  return {
    pluginId: plugin.id || '',
    totalReviews: reviewCount,
    realReviews: Math.floor(reviewCount * (realPercentage / 100)),
    suspiciousReviews: Math.floor(reviewCount * (suspiciousPercentage / 100)),
    fakeReviews: Math.floor(reviewCount * (fakePercentage / 100)),
    realPercentage,
    suspiciousPercentage,
    fakePercentage,
    sentimentAnalysis: { positive: 65, neutral: 20, negative: 15, avgSentimentScore: 0.50 },
    flaggedReviews: [],
  };
}

// Trust Score Type
export interface TrustScore {
  pluginId: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  components: {
    security: number;
    reviewAuthenticity: number;
    updateActivity: number;
    popularity: number;
  };
  breakdown: TrustScoreFactor[];
}

export interface TrustScoreFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

// Calculate Trust Score
export function calculateTrustScore(
  plugin: Plugin,
  security?: SecurityAnalysis,
  fakeReview?: FakeReviewAnalysis
): TrustScore {
  // Security score (40% weight)
  const securityScore = security?.overallScore || 75;
  
  // Review authenticity (30% weight) - based on fake review analysis
  const reviewAuthScore = fakeReview?.realPercentage || 70;
  
  // Update activity (20% weight) - based on how recently updated
  const daysSinceUpdate = plugin.lastUpdated ? Math.floor((Date.now() - new Date(plugin.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)) : 60;
  const updateScore = daysSinceUpdate < 7 ? 100 : daysSinceUpdate < 30 ? 85 : daysSinceUpdate < 90 ? 70 : 50;
  
  // Popularity (10% weight) - based on active installs
  const popularityScore = Math.min(100, Math.log10(plugin.activeInstalls + 1) * 15);
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    (securityScore * 0.40) +
    (reviewAuthScore * 0.30) +
    (updateScore * 0.20) +
    (popularityScore * 0.10)
  );
  
  // Determine grade
  let grade: TrustScore['grade'];
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 90) grade = 'A';
  else if (overallScore >= 85) grade = 'B+';
  else if (overallScore >= 80) grade = 'B';
  else if (overallScore >= 75) grade = 'C+';
  else if (overallScore >= 70) grade = 'C';
  else if (overallScore >= 60) grade = 'D';
  else grade = 'F';
  
  return {
    pluginId: plugin.id,
    overallScore,
    grade,
    components: {
      security: securityScore,
      reviewAuthenticity: reviewAuthScore,
      updateActivity: updateScore,
      popularity: popularityScore,
    },
    breakdown: [
      { name: 'Security Score', score: securityScore, weight: 0.40, description: 'Security analysis and vulnerability history' },
      { name: 'Review Authenticity', score: reviewAuthScore, weight: 0.30, description: 'Percentage of verified real reviews' },
      { name: 'Update Activity', score: updateScore, weight: 0.20, description: 'How recently the plugin was updated' },
      { name: 'Popularity', score: Math.round(popularityScore), weight: 0.10, description: 'Active installs and user base' },
    ],
  };
}
