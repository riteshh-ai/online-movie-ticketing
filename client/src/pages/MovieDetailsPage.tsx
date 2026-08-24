import type { MovieDto, ShowDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assetUrl, Movies, Shows } from "../api";

// Ported from legacy/movie_details.php's dark hero (background banner image
// + gradient overlay) with a frosted-glass info panel.
export function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [shows, setShows] = useState<ShowDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    Promise.all([Movies.get(movieId), Shows.forMovie(movieId)])
      .then(([m, s]) => {
        setMovie(m);
        setShows(s);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <div className="container"><p className="empty">Loading…</p></div>;
  if (!movie) return <div className="container"><p className="empty">Movie not found.</p></div>;

  const banner = movie.landscapePath ?? movie.posterPath;
  const showsByCinema = shows.reduce<Record<string, ShowDto[]>>((acc, s) => {
    (acc[s.cinemaName] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section
      className="movie-hero"
      style={{
        background: banner
          ? `linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(${assetUrl(banner)}) center/cover`
          : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      }}
    >
      <div className="container">
        <div className="glass-panel">
          <div>
            {movie.posterPath ? (
              <img src={assetUrl(movie.posterPath)} alt={movie.name} />
            ) : (
              <div style={{ aspectRatio: "2 / 3", background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)" }} />
            )}
          </div>
          <div>
            <h2 className="movie-title">{movie.name}</h2>
            <ul className="movie-info">
              <li>
                <strong>Director:</strong> {movie.director ?? "—"}
              </li>
              <li>
                <strong>Cast:</strong> {movie.cast ?? "—"}
              </li>
              <li>
                <strong>Duration:</strong> {movie.duration ?? "—"}
              </li>
              <li>
                <strong>Genre:</strong> {movie.genre ?? "—"}
              </li>
              <li>
                <strong>Release Date:</strong> {movie.releaseDate ?? "—"}
              </li>
              <li>
                <strong>Age Rating:</strong> {movie.ageRating ?? "—"}
              </li>
              <li>
                <strong>Language:</strong> {movie.language ?? "—"}
              </li>
              <li>
                <strong>Industry:</strong> {movie.industry ?? "—"}
              </li>
            </ul>
            {movie.description && (
              <p>
                <strong style={{ color: "var(--color-primary-bright)" }}>Description:</strong>
                <br />
                {movie.description}
              </p>
            )}

            <h3 style={{ color: "var(--color-primary-bright)", marginTop: "1.5rem" }}>Showtimes</h3>
            {shows.length === 0 && <p style={{ color: "#ccc" }}>No shows scheduled yet.</p>}
            {Object.entries(showsByCinema).map(([cinemaName, list]) => (
              <div key={cinemaName} style={{ marginBottom: "0.75rem" }}>
                <div style={{ color: "#ccc", marginBottom: "0.4rem" }}>{cinemaName}</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {list.map((s) => (
                    <Link key={s.id} to={`/booking/${s.id}`} className="btn btn-sm">
                      {s.showDate} · {s.showTimeLabel} · Rs. {s.ticketPrice}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link
              to={movie.releaseDate && new Date(movie.releaseDate) > new Date() ? "/coming-soon" : "/now-showing"}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "1.5rem", borderColor: "#fff", color: "#fff" }}
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
