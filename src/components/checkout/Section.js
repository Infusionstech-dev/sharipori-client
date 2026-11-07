export default function Section({ step, title, children }) {
  return (
    <section className="rounded-lg bg-white p-4 ring-1 ring-soft md:p-6">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-primary">
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-primary font-sans text-sm text-white"
        >
          {step}
        </span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
