import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="card mx-auto flex w-full max-w-3xl flex-col gap-5 text-center">
        <p className="eyebrow">404</p>
        <h1 className="hero-title">Page not found</h1>
        <p className="text-sm text-[color:var(--color-muted)]">
          The page you requested is unavailable or may have moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className="btn btn-primary" href="/">
            Back to home
          </Link>
          <Link className="btn btn-outline" href="/news">
            View news
          </Link>
        </div>
      </section>
    </main>
  )
}
