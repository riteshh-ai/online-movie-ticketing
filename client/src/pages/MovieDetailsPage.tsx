import { useParams } from "react-router-dom";
import { PageStub } from "../components/PageStub";

export function MovieDetailsPage() {
  const { movieId } = useParams();
  return <PageStub title={`Movie ${movieId}`} note="Replaces legacy/movie_details.php." />;
}
