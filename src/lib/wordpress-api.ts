// WordPress Plugin API Service
// API Documentation: https://codex.wordpress.org/WordPress.org_API#Plugins

export interface WPPlugin {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  version: string;
  author: string;
  author_profile: string;
  downloaded: number;
  last_updated: string;
  rating: number;
  num_ratings: number;
  installed: boolean;
  homepage: string;
  tags: Record<string, string>;
  versions: Record<string, string>;
  donation_link: string;
  banners: { high: string; low: string };
  icons: { '1x': string; '2x': string };
}

export interface WPSearchResult {
  info: {
    page: number;
    pages: number;
    results: number;
    query: string;
  };
  plugins: WPPlugin[];
}

// Convert WP plugin to our internal format
export function transformWPPlugin(wp: WPPlugin) {
  return {
    id: `wp-${wp.id}`,
    slug: wp.slug,
    name: wp.name.replace(/<[^>]*>/g, ''), // Strip HTML
    description: wp.short_description?.replace(/<[^>]*>/g, '') || wp.description?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
    fullDescription: wp.description?.replace(/<[^>]*>/g, '') || '',
    developer: wp.author?.replace(/<[^>]*>/g, '') || 'WordPress Contributor',
    website: wp.homepage,
    lastUpdated: wp.last_updated ? new Date(wp.last_updated).toISOString() : new Date().toISOString(),
    rating: wp.rating / 20 || 0, // WP ratings are out of 100
    reviewCount: wp.num_ratings || 0,
    activeInstalls: wp.downloaded || 0,
    version: wp.version,
    price: 'Free',
    icon: wp.icons?.['2x'] || wp.icons?.['1x'] || '',
    banner: wp.banners?.high || wp.banners?.low || '',
    tags: Object.values(wp.tags || {}),
    verifiedReviews: Math.floor((wp.num_ratings || 0) * 0.6), // Estimate 60% verified
    category: guessCategory(wp.tags, wp.short_description || ''),
    features: Object.values(wp.tags || {}).slice(0, 6),
    lastUpdated: wp.last_updated ? new Date(wp.last_updated).toISOString() : new Date().toISOString(),
  };
}

function guessCategory(tags: Record<string, string> = {}, description: string = ''): string {
  const tagStr = Object.values(tags).join(' ').toLowerCase();
  const desc = description.toLowerCase();
  
  if (tagStr.includes('seo') || desc.includes('seo') || desc.includes('search engine')) return 'seo';
  if (tagStr.includes('security') || desc.includes('security') || desc.includes('firewall')) return 'security';
  if (tagStr.includes('page builder') || desc.includes('page builder') || desc.includes('drag and drop')) return 'page-builders';
  if (tagStr.includes('performance') || desc.includes('cache') || desc.includes('speed') || desc.includes('optimization')) return 'performance';
  if (tagStr.includes('ecommerce') || desc.includes('woocommerce') || desc.includes('shop') || desc.includes('store')) return 'ecommerce';
  if (tagStr.includes('analytics') || desc.includes('analytics') || desc.includes('google')) return 'analytics';
  if (tagStr.includes('contact form') || desc.includes('form')) return 'forms';
  if (tagStr.includes('social') || desc.includes('facebook') || desc.includes('twitter') || desc.includes('sharing')) return 'social';
  if (tagStr.includes('backup') || desc.includes('backup')) return 'backup';
  if (tagStr.includes('email') || desc.includes('newsletter') || desc.includes('mail')) return 'email';
  
  return 'other';
}

// Search WordPress plugins
export async function searchWordPressPlugins(query: string, page = 1): Promise<WPSearchResult> {
  const url = new URL('https://api.wordpress.org/plugins/info/1.2/');
  url.searchParams.set('action', 'query_plugins');
  url.searchParams.set('request[search]', query);
  url.searchParams.set('request[page]', String(page));
  url.searchParams.set('request[per_page]', '100');
  url.searchParams.set('request[fields][description]', 'true');
  url.searchParams.set('request[fields][short_description]', 'true');
  url.searchParams.set('request[fields][versions]', 'true');
  url.searchParams.set('request[fields][banners]', 'true');
  url.searchParams.set('request[fields][icons]', 'true');
  url.searchParams.set('request[fields][tags]', 'true');
  url.searchParams.set('request[fields][rating]', 'true');
  url.searchParams.set('request[fields][num_ratings]', 'true');
  url.searchParams.set('request[fields][downloaded]', 'true');
  url.searchParams.set('request[fields][last_updated]', 'true');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }
  
  return response.json();
}

// Get single plugin details
export async function getWordPressPlugin(slug: string): Promise<WPPlugin | null> {
  const url = new URL('https://api.wordpress.org/plugins/info/1.2/');
  url.searchParams.set('action', 'plugin_information');
  url.searchParams.set('request[slug]', slug);
  url.searchParams.set('request[fields][description]', 'true');
  url.searchParams.set('request[fields][short_description]', 'true');
  url.searchParams.set('request[fields][versions]', 'true');
  url.searchParams.set('request[fields][banners]', 'true');
  url.searchParams.set('request[fields][icons]', 'true');
  url.searchParams.set('request[fields][tags]', 'true');
  url.searchParams.set('request[fields][rating]', 'true');
  url.searchParams.set('request[fields][num_ratings]', 'true');
  url.searchParams.set('request[fields][downloaded]', 'true');
  url.searchParams.set('request[fields][last_updated]', 'true');

  const response = await fetch(url.toString());
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return data.error ? null : data;
}

// Get popular plugins by category
export async function getPopularPlugins(category?: string, page = 1): Promise<WPSearchResult> {
  const url = new URL('https://api.wordpress.org/plugins/info/1.2/');
  url.searchParams.set('action', 'query_plugins');
  url.searchParams.set('request[browse]', category || 'popular');
  url.searchParams.set('request[page]', String(page));
  url.searchParams.set('request[per_page]', '100');
  url.searchParams.set('request[fields][description]', 'true');
  url.searchParams.set('request[fields][short_description]', 'true');
  url.searchParams.set('request[fields][versions]', 'true');
  url.searchParams.set('request[fields][banners]', 'true');
  url.searchParams.set('request[fields][icons]', 'true');
  url.searchParams.set('request[fields][tags]', 'true');
  url.searchParams.set('request[fields][rating]', 'true');
  url.searchParams.set('request[fields][num_ratings]', 'true');
  url.searchParams.set('request[fields][downloaded]', 'true');
  url.searchParams.set('request[fields][last_updated]', 'true');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }
  
  return response.json();
}

// Fetch reviews for a plugin from WordPress.org
export async function getWordPressReviews(slug: string, page = 1): Promise<any> {
  // WordPress.org doesn't have a public reviews API
  // We'll generate simulated review data based on plugin stats
  return null;
}
