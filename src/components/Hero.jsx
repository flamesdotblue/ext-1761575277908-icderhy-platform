import { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero({ onSearch }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <section aria-label="Hero" className="relative h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/50 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Ideas in motion
            <span className="block text-emerald-400">3D parallax storytelling</span>
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-300">
            Discover accessible, modern UI patterns with subtle depth, performance, and clarity.
          </p>

          <form
            role="search"
            aria-label="Site search"
            onSubmit={(e) => {
              e.preventDefault();
              const value = new FormData(e.currentTarget).get('q');
              onSearch(String(value || ''));
            }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <svg aria-hidden="true" className="w-5 h-5 text-neutral-400 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                ref={inputRef}
                aria-label="Search articles"
                name="q"
                type="search"
                placeholder="Search articles (⌘/Ctrl+K)"
                className="w-full bg-transparent outline-none placeholder-neutral-500 text-neutral-100 px-2 py-2"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-medium rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
