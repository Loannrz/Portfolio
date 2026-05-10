export default function Footer() {
  return (
    <footer
      className="px-7 md:px-14 py-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
      style={{ borderColor: 'var(--sand)', backgroundColor: 'var(--cream)' }}
    >
      <a
        href="/"
        className="font-display font-semibold text-sm tracking-[-0.02em] text-ink/60 hover:text-ink transition-colors"
        data-cursor="link"
      >
        OctoVisual
      </a>
      <p className="t-label text-ink/30 tracking-[0.1em]">
        © 2026 OctoVisual. Tous droits réservés.
      </p>
      <div className="flex gap-5">
        {[
          { label: 'Instagram', href: 'https://www.instagram.com/octo.visuals/' },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href !== '#' ? '_blank' : undefined}
            rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
            className="t-label text-ink/35 hover:text-ink transition-colors tracking-[0.08em]"
            data-cursor="link"
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
