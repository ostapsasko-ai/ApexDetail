import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, eyebrow, children }: PageShellProps) {
  return (
    <main>
      <section className="page-hero">
        <div className="shell page-hero__inner">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 aria-label={title}>
            {title.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                aria-hidden="true"
                className="inline-block motion-reduce:!animate-none motion-reduce:!opacity-100 motion-reduce:!blur-0"
                style={{ animation: `pageShellText .72s cubic-bezier(.16,1,.3,1) ${index * 0.075}s both` }}
              >
                {word}{index < title.split(" ").length - 1 ? "\u00a0" : ""}
              </span>
            ))}
          </h1>
          <p className="lede">{description}</p>
        </div>
      </section>
      <style>{`
        @keyframes pageShellText {
          from { opacity: 0; filter: blur(10px); transform: translateY(32px) scale(.96); }
          to { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
        }
      `}</style>
      {children}
    </main>
  );
}

