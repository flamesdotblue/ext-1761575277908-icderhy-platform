import { useEffect, useMemo, useRef, useState } from 'react';

function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const y = rect.top;
        const offset = Math.max(-40, Math.min(40, y * -0.05));
        el.style.setProperty('--parallax-y', `${offset}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return ref;
}

export default function BlogFeed({ articles, query, onOpenArticle }) {
  const [activeTilt, setActiveTilt] = useState(null);
  const ref = useParallax();

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return articles;
    return articles.filter((a) =>
      [a.title, a.excerpt, ...(a.tags || [])].join(' ').toLowerCase().includes(q)
    );
  }, [articles, query]);

  return (
    <section aria-label="Blog feed" className="relative">
      <div
        aria-hidden="true"
        ref={ref}
        className="pointer-events-none absolute -z-0 inset-x-0 -top-40 h-72"
        style={{ transform: 'translateY(var(--parallax-y))' }}
      >
        <div className="mx-auto max-w-6xl h-full blur-3xl" style={{ background: 'radial-gradient(600px 120px at 50% 10%, rgba(16,185,129,0.15), rgba(16,185,129,0) 70%)' }} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-200">Latest Articles</h2>
        <p className="text-sm text-neutral-400">{filtered.length} results</p>
      </div>

      <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <li key={a.id} className="relative">
            <button
              aria-label={`Open article: ${a.title}`}
              onClick={() => onOpenArticle(a.id)}
              onMouseEnter={() => setActiveTilt(a.id)}
              onMouseLeave={() => setActiveTilt(null)}
              onMouseMove={(e) => {
                if (activeTilt !== a.id) return;
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const cx = e.clientX - rect.left;
                const cy = e.clientY - rect.top;
                const rx = ((cy / rect.height) - 0.5) * -6;
                const ry = ((cx / rect.width) - 0.5) * 6;
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
              }}
              className="group w-full text-left rounded-2xl overflow-hidden bg-neutral-900/70 border border-neutral-800/80 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-transform will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              style={{ transform: 'perspective(900px) translateZ(0)' }}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={a.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <time dateTime={a.date}>{new Date(a.date).toLocaleDateString()}</time>
                  <span aria-hidden>•</span>
                  <span>{a.author}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {a.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-300 line-clamp-2">{a.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(a.tags || []).map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
