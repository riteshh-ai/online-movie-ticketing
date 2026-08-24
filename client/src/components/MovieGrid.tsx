import type { MovieDto } from "@mycinezone/shared";
import { Link } from "react-router-dom";
import { assetUrl } from "../api";

export function MovieGrid({ movies }: { movies: MovieDto[] }) {
  if (movies.length === 0) return <p className="empty">No movies found.</p>;

  return (
    <div className="grid">
      {movies.map((m) => (
        <Link key={m.id} to={`/movies/${m.id}`} className="movie-card">
          {m.posterPath ? (
            <img className="poster" src={assetUrl(m.posterPath)} alt={m.name} />
          ) : (
            <div className="poster" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              No image
            </div>
          )}
          <div className="body">
            <h3>{m.name}</h3>
            <div className="meta">{[m.genre, m.duration].filter(Boolean).join(" · ") || "—"}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
