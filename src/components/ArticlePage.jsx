import { useEffect, useMemo, useState } from 'react';

function ShareButtons({ title }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  return (
    <div className="flex items-center gap-3" role="group" aria-label="Share this article">
      <a
        className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Twitter"
      >Twitter</a>
      <a
        className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Facebook"
      >Facebook</a>
      <a
        className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${text}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LinkedIn"
      >LinkedIn</a>
    </div>
  );
}

function CommentForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  return (
    <form
      aria-label="Add a comment"
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ id: crypto.randomUUID(), name: name.trim() || 'Anonymous', text: text.trim(), date: new Date().toISOString() });
        setText('');
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          aria-label="Your name"
          className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="sm:col-span-2">
          <textarea
            aria-label="Your comment"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Write a comment..."
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-medium rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300">
          Post Comment
        </button>
      </div>
    </form>
  );
}

function Comments({ storageKey }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setComments(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch {}
  }, [comments, storageKey]);

  const onSubmit = (c) => setComments((prev) => [c, ...prev]);
  const onDelete = (id) => setComments((prev) => prev.filter((c) => c.id !== id));

  return (
    <section aria-label="Comments" className="mt-10">
      <h3 className="text-lg font-semibold text-neutral-200">Comments</h3>
      <div className="mt-4">
        <CommentForm onSubmit={onSubmit} />
      </div>
      <ul role="list" className="mt-6 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-300">
                <span className="font-medium text-white">{c.name}</span>
                <span className="text-neutral-500 ml-2">{new Date(c.date).toLocaleString()}</span>
              </div>
              <button
                className="text-xs text-neutral-400 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                aria-label="Delete comment"
                onClick={() => onDelete(c.id)}
              >Delete</button>
            </div>
            <p className="mt-2 text-sm text-neutral-200">{c.text}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="text-sm text-neutral-400">Be the first to comment.</li>
        )}
      </ul>
    </section>
  );
}

export default function ArticlePage({ article, related, onOpenArticle }) {
  const notFound = !article;
  const storageKey = useMemo(() => (article ? `comments:${article.id}` : 'comments:unknown'), [article]);

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-white">Article not found</h2>
        <p className="text-neutral-400 mt-2">Try going back to the blog.</p>
        <a href="#/" className="inline-flex mt-6 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-medium rounded-lg px-4 py-2">Back to Blog</a>
      </div>
    );
  }

  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-8">
        <h1 className="!mb-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{article.title}</h1>
        <div className="text-sm text-neutral-400 flex items-center gap-2">
          <time dateTime={article.date}>{new Date(article.date).toLocaleDateString()}</time>
          <span aria-hidden>•</span>
          <span>{article.author}</span>
          <div className="ml-auto"><ShareButtons title={article.title} /></div>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <img src={article.image} alt="" className="w-full h-[300px] sm:h-[420px] object-cover" />
      </div>

      <div className="mt-8 text-neutral-200 leading-relaxed">
        {article.content.split('\n').map((p, i) => (
          <p key={i} className="mb-4">{p}</p>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(article.tags || []).map((t) => (
          <span key={t} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
            {t}
          </span>
        ))}
      </div>

      <Comments storageKey={storageKey} />

      <section aria-label="Related articles" className="mt-12">
        <h3 className="text-lg font-semibold text-neutral-200">Related articles</h3>
        <ul role="list" className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => onOpenArticle(r.id)}
                className="w-full text-left flex gap-4 bg-neutral-900/70 border border-neutral-800 rounded-xl p-3 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={`Open article: ${r.title}`}
              >
                <img src={r.image} alt="" className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h4 className="text-white font-medium line-clamp-2">{r.title}</h4>
                  <p className="text-sm text-neutral-400 line-clamp-2">{r.excerpt}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
