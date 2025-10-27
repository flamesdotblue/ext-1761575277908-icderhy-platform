import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import BlogFeed from './components/BlogFeed';
import ArticlePage from './components/ArticlePage';
import Directory from './components/Directory';

const initialArticles = [
  {
    id: 'neural-interfaces-2025',
    title: 'Neural Interfaces in 2025: A Practical Overview',
    excerpt:
      'Exploring the state of neural input devices, ethical considerations, and the design patterns emerging for everyday apps.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    date: '2025-06-02',
    author: 'Ava Miller',
    tags: ['AI', 'UX', 'Ethics'],
    content:
      `Neural interfaces are moving from research labs to consumer products. In this article, we examine practical design considerations, accessibility guidelines, and performance constraints. We also explore how to communicate probabilistic input and confidence states.

Core topics:
- Input latency and feedback
- Consent and ethical safeguards
- Fallback controls and accessibility
- Cross-platform support and privacy-first telemetry

By focusing on clarity, consent, and control, teams can reduce user risk while shipping meaningful neural features.`,
  },
  {
    id: 'edge-compute-patterns',
    title: 'Edge Compute Patterns for Realtime UX',
    excerpt:
      'Latency-sensitive interfaces benefit from edge-first architectures. Here are patterns that scale and remain debuggable.',
    image:
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1600&auto=format&fit=crop',
    date: '2025-05-11',
    author: 'Kai Nguyen',
    tags: ['Edge', 'Performance', 'DevOps'],
    content:
      `Pushing logic to the edge can reduce round-trips and jitter for realtime experiences. We outline deployment strategies, caching layers, and observability techniques that keep systems robust and explainable.`,
  },
  {
    id: 'accessible-3d-ux',
    title: 'Making 3D Interfaces Accessible',
    excerpt:
      'From motion reduction to keyboard-first navigation, here are practical ways to ship accessible 3D web experiences.',
    image:
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1600&auto=format&fit=crop',
    date: '2025-04-22',
    author: 'Jordan Lee',
    tags: ['Accessibility', '3D', 'Frontend'],
    content:
      `3D can be inclusive. Use semantic markup, skip links, proper ARIA roles, and motion-safe preferences. Provide alternate views and reduce motion for users who prefer it.`,
  },
];

const initialDirectory = [
  {
    id: 'vision-suite',
    name: 'Vision Suite',
    category: 'Software',
    price: 49,
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop',
    description:
      'A computer-vision toolkit for rapid prototyping and edge deployment with built-in privacy controls.',
    features: ['On-device inference', 'Model compression', 'Privacy-first'],
    ctaLabel: 'Start Free Trial',
    url: '#/product/vision-suite',
    details:
      'Vision Suite helps teams deploy robust CV pipelines to the edge with minimal latency and strong privacy. Includes a model zoo and profiling tools.',
  },
  {
    id: 'aurora-consulting',
    name: 'Aurora Consulting',
    category: 'Service',
    price: 150,
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
    description:
      'Expert guidance on distributed systems, observability, and cost optimization for modern teams.',
    features: ['Architecture reviews', 'SLO alignment', 'Cost controls'],
    ctaLabel: 'Book a Session',
    url: '#/product/aurora-consulting',
    details:
      'We partner with your team to design resilient, observable systems with predictable spend and performance.',
  },
  {
    id: 'lumen-hosting',
    name: 'Lumen Hosting',
    category: 'Platform',
    price: 29,
    image:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop',
    description:
      'Global edge hosting with automatic SSL, previews, and first-class observability.',
    features: ['Edge network', 'Instant rollbacks', 'Global analytics'],
    ctaLabel: 'Deploy Now',
    url: '#/product/lumen-hosting',
    details:
      'Deploy secure, scalable apps at the edge with instant rollbacks and live analytics across regions.',
  },
];

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, (r) => (window.location.hash = r)];
}

export default function App() {
  const [route, navigate] = useHashRoute();
  const [query, setQuery] = useState('');

  const parsed = useMemo(() => {
    const clean = route.replace(/^#/, '');
    const parts = clean.split('/').filter(Boolean);
    // routes: / -> home, /article/:id, /directory, /product/:id
    if (parts.length === 0) return { page: 'home' };
    if (parts[0] === 'article' && parts[1]) return { page: 'article', id: parts[1] };
    if (parts[0] === 'directory') return { page: 'directory' };
    if (parts[0] === 'product' && parts[1]) return { page: 'product', id: parts[1] };
    return { page: 'home' };
  }, [route]);

  const onSearch = (value) => {
    setQuery(value);
    if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
      // already on home
    } else {
      navigate('#/');
    }
  };

  const accent = 'text-emerald-400';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950/80 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('#/')}
            className="font-semibold tracking-tight text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
            aria-label="Go to home"
          >
            Grid<span className={accent}>Sphere</span>
          </button>
          <nav aria-label="Primary" className="flex items-center gap-4">
            <a
              href="#/"
              className="text-sm text-neutral-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
            >Blog</a>
            <a
              href="#/directory"
              className="text-sm text-neutral-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
            >Directory</a>
            <a
              href="https://twitter.com/intent/follow?screen_name=vercel"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
            >Follow</a>
          </nav>
        </div>
      </header>

      {parsed.page === 'home' && (
        <>
          <Hero onSearch={onSearch} />
          <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <BlogFeed
              articles={initialArticles}
              query={query}
              onOpenArticle={(id) => navigate(`#/article/${id}`)}
            />
          </main>
        </>
      )}

      {parsed.page === 'article' && (
        <main id="article" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <ArticlePage
            article={initialArticles.find((a) => a.id === parsed.id)}
            related={initialArticles.filter((a) => a.id !== parsed.id).slice(0, 3)}
            onOpenArticle={(id) => navigate(`#/article/${id}`)}
          />
        </main>
      )}

      {parsed.page === 'directory' && (
        <main id="directory" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Directory
            items={initialDirectory}
            onOpenItem={(id) => navigate(`#/product/${id}`)}
          />
        </main>
      )}

      {parsed.page === 'product' && (
        <main id="product" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Directory
            items={initialDirectory}
            focusId={parsed.id}
            onOpenItem={() => {}}
          />
        </main>
      )}

      <footer className="border-t border-neutral-800 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} GridSphere. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#/" className="hover:text-white">Blog</a>
            <a href="#/directory" className="hover:text-white">Directory</a>
            <a href="#main" className="hover:text-white">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
