import type { MovieDto } from "@mycinezone/shared";
import { Link } from "react-router-dom";
import { assetUrl } from "../api";
import { useAuth } from "../context/AuthContext";

// Ported from legacy's Bootstrap `card h-100 shadow-sm` movie grid
// (index.php / nowshowing.php / commingsoon.php) — image, title, release
// date, and a full-width darkcyan footer button.
export function MovieGrid({ movies }: { movies: MovieDto[] }) {
  const { customer } = useAuth();

  if (movies.length === 0) return <p className="empty">No movies found.</p>;

  return (
    <div className="grid">
      {movies.map((m) => {
        const isUpcoming = m.releaseDate ? new Date(m.releaseDate) > new Date() : false;
        return (
          <div key={m.id} className="movie-card">
            <Link to={`/movies/${m.id}`}>
              {m.posterPath ? (
                <img className="poster" src={assetUrl(m.posterPath)} alt={m.name} />
              ) : (
                <div className="poster" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  No image
                </div>
              )}
              <div className="body">
                <h3>{m.name}</h3>
                <div className="meta">Release Date: {m.releaseDate ?? "TBA"}</div>
              </div>
            </Link>
            {isUpcoming ? (
              <Link className="footer-btn" to={`/movies/${m.id}`}>
                View Details
              </Link>
            ) : customer ? (
              <Link className="footer-btn" to={`/movies/${m.id}`}>
                Book Ticket
              </Link>
            ) : (
              <Link className="footer-btn" to="/login">
                Login to Book
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
