/** Placeholder for a page scaffolded but not yet built out. */
export function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>{title}</h1>
      <p style={{ color: "#666" }}>{note}</p>
    </div>
  );
}
