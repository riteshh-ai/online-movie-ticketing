import type { MovieDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Movies } from "../api";
import { MovieGrid } from "../components/MovieGrid";

export function NowShowingPage() {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Movies.nowShowing()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>Now Showing</h1>
      {loading ? <p className="empty">Loading…</p> : <MovieGrid movies={movies} />}
    </>
  );
}
