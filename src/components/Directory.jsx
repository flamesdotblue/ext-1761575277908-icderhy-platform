import { useMemo, useState } from 'react';

function Badge({ children }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
      {children}
    </span>
  );
}

function DirectoryFilters({ items, onChange }) {
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [price, setPrice] = useState(200);

  return (
    <form
      className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 md:items-end"
      aria-label="Directory filters"
      onSubmit={(e) => {
        e.preventDefault();
        onChange({ q, cat, price });
      }}
    >
      <div className="flex-1">
        <label htmlFor="dq" className="block text-sm text-neutral-300 mb-1">Search</label>
        <input
          id="dq"
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Find a product or service"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="w-full md:w-52">
        <label htmlFor="dc" className="block text-sm text-neutral-300 mb-1">Category</label>
        <select
          id="dc"
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-64">
        <label htmlFor="dp" className="block text-sm text-neutral-300 mb-1">Max Price: ${price}</label>
        <input
          id="dp"
          type="range"
          min="0"
          max="200"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="md:self-center">
        <button type="submit" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-medium rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300">
          Apply Filters
        </button>
      </div>
    </form>
  );
}

function ItemCard({ item, onOpen }) {
  return (
    <button
      onClick={() => onOpen(item.id)}
      className="text-left w-full rounded-2xl overflow-hidden bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label={`Open ${item.name}`}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img src={item.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{item.name}</h3>
          <Badge>{item.category}</Badge>
        </div>
        <p className="mt-2 text-sm text-neutral-300 line-clamp-2">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-emerald-400 font-medium">${item.price}<span className="text-neutral-400 text-sm">/mo</span></span>
          <span className="text-sm text-neutral-400">Learn more →</span>
        </div>
      </div>
    </button>
  );
}

function Detail({ item }) {
  if (!item) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-semibold text-white">Item not found</h2>
      <a href="#/directory" className="inline-flex mt-6 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-medium rounded-lg px-4 py-2">Back to Directory</a>
    </div>
  );

  return (
    <section aria-label={`${item.name} details`} className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <img src={item.image} alt="" className="w-full h-[320px] sm:h-[480px] object-cover" />
      </div>
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{item.name}</h1>
            <div className="mt-2"><Badge>{item.category}</Badge></div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-2xl font-semibold">${item.price}<span className="text-sm text-neutral-400">/mo</span></div>
          </div>
        </div>
        <p className="mt-4 text-neutral-300 leading-relaxed">{item.details}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.features.map((f) => (
            <li key={f} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">{f}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={item.url}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-medium rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            {item.ctaLabel}
          </a>
          <a
            href="#/directory"
            className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg px-4 py-2 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Back to Directory
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Directory({ items, focusId, onOpenItem }) {
  const [filters, setFilters] = useState({ q: '', cat: 'All', price: 200 });

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    return items.filter((i) => {
      const matchesQ = !q || `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q);
      const matchesCat = filters.cat === 'All' || i.category === filters.cat;
      const matchesPrice = i.price <= filters.price;
      return matchesQ && matchesCat && matchesPrice;
    });
  }, [items, filters]);

  if (focusId) {
    const selected = items.find((i) => i.id === focusId);
    return <Detail item={selected} />;
  }

  return (
    <section>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product & Service Directory</h1>
          <p className="text-neutral-400 text-sm">Filter and explore offerings with high-quality imagery and clear CTAs.</p>
        </div>
      </header>

      <DirectoryFilters items={items} onChange={setFilters} />

      <ul role="list" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <li key={item.id}>
            <ItemCard item={item} onOpen={(id) => (onOpenItem ? onOpenItem(id) : null)} />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-neutral-400">No items match your filters.</li>
        )}
      </ul>
    </section>
  );
}
