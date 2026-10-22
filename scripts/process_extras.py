"""Builds the About photo, certificate previews and cert/club logo thumbnails.

- assets-src/me.jpeg              -> public/images/me-420.webp, me-640.webp
- public/certificates/*.pdf|image -> public/certificates/previews/<stem>-p<N>.webp
  (every page, so the lightbox can show PDFs as images on any device)
- src/assets/logos/*.png|jpeg|jpg -> src/assets/logos/<name>.webp (160px, used by the site)

Run with:  python scripts/process_extras.py   (also part of `npm run images`)
"""

from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CERTS = ROOT / "public" / "certificates"
PREVIEWS = CERTS / "previews"
LOGOS = ROOT / "src" / "assets" / "logos"


def photo() -> None:
    src = ROOT / "assets-src" / "me.jpeg"
    if not src.exists():
        return
    img = Image.open(src).convert("RGB")
    for w in (420, 640):
        out = ROOT / "public" / "images" / f"me-{w}.webp"
        img.resize((w, round(img.height * w / img.width)), Image.LANCZOS).save(out, "WEBP", quality=84, method=6)
        print(f"  {out.relative_to(ROOT)}")


def previews() -> None:
    PREVIEWS.mkdir(exist_ok=True)
    for f in sorted(CERTS.iterdir()):
        if f.suffix.lower() == ".pdf":
            doc = pymupdf.open(f)
            for i, page in enumerate(doc, start=1):
                # ~1600px on the long edge: sharp when zoomed, still small as WebP.
                zoom = 1600 / max(page.rect.width, page.rect.height)
                pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
                img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
                out = PREVIEWS / f"{f.stem}-p{i}.webp"
                img.save(out, "WEBP", quality=82, method=6)
                print(f"  {out.relative_to(ROOT)}  {img.width}x{img.height}  {out.stat().st_size // 1024} KB")
        elif f.suffix.lower() in {".png", ".jpg", ".jpeg"}:
            img = Image.open(f).convert("RGB")
            img.thumbnail((1600, 1600), Image.LANCZOS)
            out = PREVIEWS / f"{f.stem}-p1.webp"
            img.save(out, "WEBP", quality=82, method=6)
            print(f"  {out.relative_to(ROOT)}")


def logos() -> None:
    for f in sorted(LOGOS.iterdir()):
        if f.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        img = Image.open(f).convert("RGBA")
        img.thumbnail((160, 160), Image.LANCZOS)
        out = LOGOS / f"{f.stem}.webp"
        img.save(out, "WEBP", quality=88, method=6)
        print(f"  {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    photo()
    previews()
    logos()
