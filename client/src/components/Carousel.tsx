import { useEffect, useState } from "react";
import { assetUrl } from "../api";

// Ported from legacy/index.php's Bootstrap carousel (id="carouselId") fed by
// the `slider` table — reimplemented without jQuery/Bootstrap JS.
export function Carousel({ images }: { images: Array<{ id: number; imageUrl: string; altText: string | null }> }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="hero-carousel">
      {images.map((img, i) => (
        <div key={img.id} className={`slide${i === index ? " active" : ""}`}>
          <img src={assetUrl(img.imageUrl)} alt={img.altText ?? ""} />
        </div>
      ))}
      {images.length > 1 && (
        <>
          <button className="arrow prev" onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Previous slide">
            <i className="fa fa-chevron-left" />
          </button>
          <button className="arrow next" onClick={() => setIndex((i) => (i + 1) % images.length)} aria-label="Next slide">
            <i className="fa fa-chevron-right" />
          </button>
          <div className="dots">
            {images.map((img, i) => (
              <button
                key={img.id}
                className={i === index ? "active" : ""}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
