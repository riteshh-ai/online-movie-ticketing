import type { MovieDto, SliderDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Movies, Sliders } from "../api";
import { Carousel } from "../components/Carousel";
import { MovieGrid } from "../components/MovieGrid";

// Ported from legacy/index.php — slider carousel, search results, now-showing
// + coming-soon grids. Search now lives in the navbar (Layout.tsx) instead
// of a page-body form, and results replace the two grids via ?q=.
export function HomePage() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";

  const [sliders, setSliders] = useState<SliderDto[]>([]);
  const [nowShowing, setNowShowing] = useState<MovieDto[]>([]);
  const [comingSoon, setComingSoon] = useState<MovieDto[]>([]);
  const [results, setResults] = useState<MovieDto[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Sliders.list().then(setSliders);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (q) {
      Movies.list(q)
        .then(setResults)
        .finally(() => setLoading(false));
    } else {
      setResults(null);
      Promise.all([Movies.nowShowing(), Movies.comingSoon()])
        .then(([now, soon]) => {
          setNowShowing(now);
          setComingSoon(soon);
        })
        .finally(() => setLoading(false));
    }
  }, [q]);

  return (
    <>
      {!q && <Carousel images={sliders} />}

      <div className="container" style={{ paddingTop: "2.5rem" }}>
        {loading ? (
          <p className="empty">Loading…</p>
        ) : results ? (
          <>
            <h2 className="section-heading">Search Results for &ldquo;{q}&rdquo;</h2>
            <MovieGrid movies={results} />
          </>
        ) : (
          <>
            <h2 className="section-heading">Now Showing</h2>
            <MovieGrid movies={nowShowing} />
            <h2 className="section-heading" style={{ marginTop: "3rem" }}>
              Coming Soon
            </h2>
            <MovieGrid movies={comingSoon} />
          </>
        )}
      </div>
    </>
  );
}
