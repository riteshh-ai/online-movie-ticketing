import { PageStub } from "../../components/PageStub";

// Replaces the four near-identical lookup-table CRUD pages in legacy/Admin:
// genre, industry, language, showtime — one tabbed page instead of four
// copy-pasted ones, mirroring server/src/routes/admin/catalog.routes.ts.
export function AdminCatalogPage() {
  return <PageStub title="Genres / Industries / Languages / Showtimes" note="Replaces legacy/Admin/*genre.php, *industry.php, *language.php, *showtime.php." />;
}
