import fs from "node:fs";
import path from "node:path";
import multer from "multer";

// Replaces move_uploaded_file() into legacy's inconsistently-cased Images/
// directories (PROJECT_REFERENCE.md §2) — everything lands under a single
// lowercase server/uploads/<subdir>/, served statically by app.ts.
function storageFor(subdir: string) {
  const dir = path.resolve("uploads", subdir);
  fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });
}

export function uploadPathFor(subdir: string, filename: string): string {
  return `/uploads/${subdir}/${filename}`;
}

export const uploadMovieImages = multer({ storage: storageFor("movies") }).fields([
  { name: "poster", maxCount: 1 },
  { name: "landscape", maxCount: 1 },
]);

export const uploadSliderImage = multer({ storage: storageFor("sliders") }).single("image");
