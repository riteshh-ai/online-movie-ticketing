import type { MovieDto, ShowDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assetUrl, Movies, Shows } from "../api";

// Replaces legacy/movie_details.php?movie_id=
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

  if (loading) return <p className="empty">Loading…</p>;
  if (!movie) return <p className="empty">Movie not found.</p>;

  const showsByCinema = shows.reduce<Record<string, ShowDto[]>>((acc, s) => {
    (acc[s.cinemaName] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }}>
      <div>
        {movie.posterPath ? (
          <img src={assetUrl(movie.posterPath)} alt={movie.name} style={{ borderRadius: "var(--radius-md)" }} />
        ) : (
          <div
            className="card"
            style={{ aspectRatio: "2 / 3", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            No image
          </div>
        )}
      </div>
      <div>
        <h1>{movie.name}</h1>
        <p style={{ color: "var(--text-tertiary)" }}>
          {[movie.genre, movie.language, movie.industry, movie.duration, movie.ageRating].filter(Boolean).join(" · ") || "—"}
        </p>
        {movie.releaseDate && <p>Release date: {movie.releaseDate}</p>}
        {movie.director && <p>Director: {movie.director}</p>}
        {movie.cast && <p>Cast: {movie.cast}</p>}
        {movie.description && <p>{movie.description}</p>}

        <h2 className="section-title">Showtimes</h2>
        {shows.length === 0 && <p className="empty">No shows scheduled yet.</p>}
        {Object.entries(showsByCinema).map(([cinemaName, list]) => (
          <div key={cinemaName} className="card" style={{ marginBottom: "1rem" }}>
            <h3>{cinemaName}</h3>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {list.map((s) => (
                <Link key={s.id} to={`/booking/${s.id}`} className="btn btn-secondary btn-sm">
                  {s.showDate} · {s.showTimeLabel} · Rs. {s.ticketPrice}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
