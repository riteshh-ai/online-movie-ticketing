import type { SliderDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminSliders, ApiError, assetUrl } from "../../api";

// Replaces legacy/Admin/add|edit|view|deleteslider.php (homepage banner
// images). Mutations are super-admin only.
export function AdminSlidersPage() {
  const [sliders, setSliders] = useState<SliderDto[]>([]);
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    AdminSliders.list().then(setSliders);
  }
  useEffect(refresh, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose an image.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      if (altText) fd.append("altText", altText);
      await AdminSliders.create(fd);
      setAltText("");
      setFile(null);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload slider image.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this slider image?")) return;
    try {
      await AdminSliders.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete slider image.");
    }
  }

  return (
    <>
      <h1>Homepage Sliders</h1>
      {error && <div className="form-error">{error}</div>}

      <div className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
        <h3>Add slider image</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Image</label>
            <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="field">
            <label>Alt text (optional)</label>
            <input value={altText} onChange={(e) => setAltText(e.target.value)} />
          </div>
          <button className="btn" disabled={submitting}>
            {submitting ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>

      <div className="grid">
        {sliders.map((s) => (
          <div className="card" key={s.id}>
            <img src={assetUrl(s.imageUrl)} alt={s.altText ?? ""} style={{ borderRadius: "var(--radius-sm)", marginBottom: "0.75rem" }} />
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
              Delete
            </button>
          </div>
        ))}
        {sliders.length === 0 && <p className="empty">No slider images yet.</p>}
      </div>
    </>
  );
}
