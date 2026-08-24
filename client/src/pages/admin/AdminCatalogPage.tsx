import type { LookupDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminGenres, AdminIndustries, AdminLanguages, AdminShowTimes, ApiError } from "../../api";

type CatalogApi = {
  list: () => Promise<LookupDto[]>;
  create: (value: string) => Promise<LookupDto>;
  update: (id: number, value: string) => Promise<LookupDto>;
  remove: (id: number) => Promise<void>;
};

function LookupManager({ title, api }: { title: string; api: CatalogApi }) {
  const [items, setItems] = useState<LookupDto[]>([]);
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    api.list().then(setItems);
  }
  useEffect(refresh, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    try {
      await api.create(value.trim());
      setValue("");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add.");
    }
  }

  async function handleSaveEdit(id: number) {
    try {
      await api.update(id, editValue.trim());
      setEditingId(null);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, "")}?`)) return;
    try {
      await api.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete.");
    }
  }

  return (
    <div className="card">
      <h3>{title}</h3>
      {error && <div className="form-error">{error}</div>}
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              padding: "0.4rem 0",
              borderBottom: "1px solid var(--border-default)",
            }}
          >
            {editingId === item.id ? (
              <>
                <input value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-sm" onClick={() => handleSaveEdit(item.id)}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ flex: 1 }}>{item.name}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditValue(item.name);
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="empty">None yet.</li>}
      </ul>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem" }}>
        <input placeholder={`New ${title.toLowerCase().replace(/s$/, "")}`} value={value} onChange={(e) => setValue(e.target.value)} />
        <button className="btn btn-sm">Add</button>
      </form>
    </div>
  );
}

// Replaces the four near-identical lookup-table CRUD quartets in legacy/Admin:
// add|edit|view|delete genre.php, industry.php, language.php, showtime.php.
// Mutations are super-admin only server-side.
export function AdminCatalogPage() {
  return (
    <>
      <h1>Catalog</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <LookupManager title="Genres" api={AdminGenres} />
        <LookupManager title="Industries" api={AdminIndustries} />
        <LookupManager title="Languages" api={AdminLanguages} />
        <LookupManager title="Showtimes" api={AdminShowTimes} />
      </div>
    </>
  );
}
