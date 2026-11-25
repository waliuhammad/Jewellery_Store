export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div role="status" className="rounded-card border border-dashed border-rose-border bg-card p-10 text-center">
      <p className="font-heading text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
    </div>
  );
}
