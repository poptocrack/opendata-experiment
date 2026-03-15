export function Section({
  label,
  title,
  children
}: {
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      <p className="mt-1 text-xl font-bold">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
