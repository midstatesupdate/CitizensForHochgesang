type RouteLoadingProps = {
  label: string
  title: string
  description: string
}

export function RouteLoading({label, title, description}: RouteLoadingProps) {
  return (
    <main className="page-shell" aria-busy="true" aria-live="polite">
      <section className="flex flex-col gap-4">
        <p className="eyebrow">{label}</p>
        <h1 className="section-title">{title}</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">{description}</p>
      </section>

      <section className="grid gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="card grid gap-3">
            <div className="loading-bar h-4 w-40 rounded-full" />
            <div className="loading-bar h-8 w-3/4 rounded-full" />
            <div className="loading-bar h-4 w-full rounded-full" />
            <div className="loading-bar h-4 w-5/6 rounded-full" />
          </div>
        ))}
      </section>
    </main>
  )
}
