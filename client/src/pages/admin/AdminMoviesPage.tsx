import type { LookupDto, MovieDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminGenres, AdminIndustries, AdminLanguages, AdminMovies, ApiError, assetUrl } from "../../api";

// Replaces legacy/Admin/add|edit|view|deletemovie.php. Poster + landscape
// banner upload via multer on the server, replacing move_uploaded_file()
// (see server/src/utils/upload.ts).
type MovieForm = {
  name: string;
  description: string;
  releaseDate: string;
  duration: string;
  director: string;
  cast: string;
  ageRating: string;
  genreId: string;
  industryId: string;
  languageId: string;
};

const emptyForm: MovieForm = {
  name: "",
  description: "",
  releaseDate: "",
  duration: "",
  director: "",
  cast: "",
  ageRating: "",
  genreId: "",
  industryId: "",
  languageId: "",
};

export function AdminMoviesPage() {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [genres, setGenres] = useState<LookupDto[]>([]);
  const [industries, setIndustries] = useState<LookupDto[]>([]);
  const [languages, setLanguages] = useState<LookupDto[]>([]);
  const [form, setForm] = useState<MovieForm>(emptyForm);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [landscapeFile, setLandscapeFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    AdminMovies.list().then(setMovies);
  }

  useEffect(() => {
    refresh();
    AdminGenres.list().then(setGenres);
    AdminIndustries.list().then(setIndustries);
    AdminLanguages.list().then(setLanguages);
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setPosterFile(null);
    setLandscapeFile(null);
    setShowForm(true);
  }

  function startEdit(m: MovieDto) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      description: m.description ?? "",
      releaseDate: m.releaseDate ?? "",
      duration: m.duration ?? "",
      director: m.director ?? "",
      cast: m.cast ?? "",
      ageRating: m.ageRating ?? "",
      genreId: m.genreId ? String(m.genreId) : "",
      industryId: m.industryId ? String(m.industryId) : "",
      languageId: m.languageId ? String(m.languageId) : "",
    });
    setPosterFile(null);
    setLandscapeFile(null);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      if (posterFile) fd.append("poster", posterFile);
      if (landscapeFile) fd.append("landscape", landscapeFile);

      if (editingId) await AdminMovies.update(editingId, fd);
      else await AdminMovies.create(fd);

      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save movie.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this movie? This also removes its shows and bookings.")) return;
    try {
      await AdminMovies.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete movie.");
    }
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Movies</h1>
        <button className="btn" onClick={startCreate}>
          + Add movie
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3>{editingId ? "Edit movie" : "New movie"}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <div className="field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Release date</label>
                <input type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
              </div>
              <div className="field">
                <label>Duration</label>
                <input
                  placeholder="e.g. 2h 15m"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Age rating</label>
                <input value={form.ageRating} onChange={(e) => setForm({ ...form, ageRating: e.target.value })} />
              </div>
              <div className="field">
                <label>Director</label>
                <input value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} />
              </div>
              <div className="field">
                <label>Cast (comma separated)</label>
                <input value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} />
              </div>
              <div className="field">
                <label>Genre</label>
                <select value={form.genreId} onChange={(e) => setForm({ ...form, genreId: e.target.value })}>
                  <option value="">—</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Industry</label>
                <select value={form.industryId} onChange={(e) => setForm({ ...form, industryId: e.target.value })}>
                  <option value="">—</option>
                  {industries.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Language</label>
                <select value={form.languageId} onChange={(e) => setForm({ ...form, languageId: e.target.value })}>
                  <option value="">—</option>
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Poster image {editingId && "(leave blank to keep current)"}</label>
                <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="field">
                <label>Landscape banner {editingId && "(leave blank to keep current)"}</label>
                <input type="file" accept="image/*" onChange={(e) => setLandscapeFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="row-actions">
              <button className="btn" disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Name</th>
              <th>Genre</th>
              <th>Release date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.posterPath ? (
                    <img src={assetUrl(m.posterPath)} alt="" style={{ width: 40, height: 60, objectFit: "cover", borderRadius: 4 }} />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{m.name}</td>
                <td>{m.genre ?? "—"}</td>
                <td>{m.releaseDate ?? "—"}</td>
                <td className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => startEdit(m)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No movies yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
