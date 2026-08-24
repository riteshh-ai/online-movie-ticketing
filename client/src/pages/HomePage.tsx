import type { MovieDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { Movies } from "../api";
import { MovieGrid } from "../components/MovieGrid";

// Replaces legacy/index.php — slider, search, now-showing + coming-soon grids.
export function HomePage() {
  const [nowShowing, setNowShowing] = useState<MovieDto[]>([]);
  const [comingSoon, setComingSoon] = useState<MovieDto[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieDto[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([Movies.nowShowing(), Movies.comingSoon()])
      .then(([now, soon]) => {
        setNowShowing(now);
        setComingSoon(soon);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setResults(await Movies.list(query.trim()));
  }

  return (
    <>
      <section className="hero">
        <h1>Book your next movie night</h1>
        <p>Browse now-showing and coming-soon movies, pick your seats, and pay at the counter or with eSewa.</p>
        <form className="search-box" onSubmit={handleSearch}>
          <input placeholder="Search movies…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn" type="submit">
            Search
          </button>
        </form>
      </section>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : results ? (
        <>
          <h2>Search results for &ldquo;{query}&rdquo;</h2>
          <MovieGrid movies={results} />
        </>
      ) : (
        <>
          <h2>Now Showing</h2>
          <MovieGrid movies={nowShowing} />
          <h2 style={{ marginTop: "2.5rem" }}>Coming Soon</h2>
          <MovieGrid movies={comingSoon} />
        </>
      )}
    </>
  );
}
