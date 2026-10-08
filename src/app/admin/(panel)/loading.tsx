/** Shown instantly while an admin page loads, so every click visibly opens something. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Wird geladen" className="animate-[toast-in_0.2s_ease-out_both]">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-3 h-8 w-64" />
      <div className="skeleton mt-2 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line py-3.5 last:border-0">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-4 w-1/5" />
            <div className="skeleton ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
