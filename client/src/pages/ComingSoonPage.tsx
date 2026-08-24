import type { MovieDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Movies } from "../api";
import { MovieGrid } from "../components/MovieGrid";

export function ComingSoonPage() {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Movies.comingSoon()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2 className="section-heading">Coming Soon</h2>
      {loading ? <p className="empty">Loading…</p> : <MovieGrid movies={movies} />}
    </div>
  );
}
