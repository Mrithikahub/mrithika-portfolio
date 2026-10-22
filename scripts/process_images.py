"""Builds the web-ready avatar assets from the source PNGs in assets-src/.

- Crops away the sparkle watermark in the bottom-right corner
- Removes the grey studio background from avatar-standing (rembg)
- Cuts a head-and-shoulders portrait for the section transitions
- Exports responsive WebP files, the Open Graph image and favicons

Run with:  python scripts/process_images.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src"
OUT = ROOT / "public" / "images"
PUBLIC = ROOT / "public"


def save_webp(img: Image.Image, name: str, widths: list[int], quality: int = 82) -> None:
    for w in widths:
        h = round(img.height * w / img.width)
        resized = img.resize((w, h), Image.LANCZOS)
        path = OUT / f"{name}-{w}.webp"
        resized.save(path, "WEBP", quality=quality, method=6)
        print(f"  {path.relative_to(ROOT)}  {w}x{h}  {path.stat().st_size // 1024} KB")


def hero() -> Image.Image:
    img = Image.open(SRC / "avatar-hero.png").convert("RGB")
    # Watermark sits around (905, 905). Trim the bottom band; the desk edge stays.
    img = img.crop((0, 0, 1024, 868))
    save_webp(img, "avatar-hero", [640, 1024])
    return img


def desk() -> None:
    img = Image.open(SRC / "avatar-desk.png").convert("RGB")
    # Watermark sits around (920, 662).
    img = img.crop((0, 0, 1024, 632))
    save_webp(img, "avatar-desk", [640, 1024])


def standing() -> Image.Image:
    from rembg import new_session, remove

    img = Image.open(SRC / "avatar-standing.png").convert("RGB")
    # isnet-general-use is light enough for a laptop and clean on studio backdrops.
    cut = remove(img, session=new_session("isnet-general-use"))
    alpha = cut.getchannel("A")
    # Drop faint halo pixels and anything left of the watermark area.
    alpha = alpha.point(lambda a: 0 if a < 24 else a)
    cut.putalpha(alpha)
    draw = ImageDraw.Draw(alpha)
    draw.rectangle((860, 600, 1024, 765), fill=0)
    cut.putalpha(alpha)
    bbox = alpha.getbbox()
    assert bbox, "rembg returned an empty mask"
    pad = 12
    box = (max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, cut.width), min(bbox[3] + pad, cut.height))
    figure = cut.crop(box)
    save_webp(figure, "avatar-standing", [420, 640], quality=86)
    return figure


def head(figure: Image.Image) -> Image.Image:
    # Head, raised hands and shoulders: the top ~44% of the figure.
    h = round(figure.height * 0.44)
    portrait = figure.crop((0, 0, figure.width, h))
    bbox = portrait.getchannel("A").getbbox()
    portrait = portrait.crop(bbox)
    save_webp(portrait, "avatar-head", [360, 560], quality=86)
    return portrait


def og_image(hero_img: Image.Image) -> None:
    canvas = Image.new("RGB", (1200, 630), (248, 243, 234))
    scene = hero_img.resize((round(hero_img.width * 630 / hero_img.height), 630), Image.LANCZOS)
    canvas.paste(scene, (1200 - scene.width, 0))
    canvas.save(PUBLIC / "og-image.jpg", "JPEG", quality=86, optimize=True)
    print("  public/og-image.jpg  1200x630")


def favicons(portrait: Image.Image) -> None:
    for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (512, "icon-512.png")]:
        scale = 4
        big = size * scale
        canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        mask = Image.new("L", (big, big), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, big - 1, big - 1), fill=255)
        bg = Image.new("RGBA", (big, big), (242, 98, 46, 255))
        canvas.paste(bg, (0, 0), mask)
        # Tight crop around the face so it still reads at 32px.
        fw = portrait.width
        face = portrait.crop((round(fw * 0.16), 0, round(fw * 0.84), portrait.height))
        ratio = (big * 0.96) / max(face.width, face.height)
        face = face.resize((round(face.width * ratio), round(face.height * ratio)), Image.LANCZOS)
        layer = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        layer.paste(face, ((big - face.width) // 2, big - face.height), face)
        layer.putalpha(Image.composite(layer.getchannel("A"), Image.new("L", (big, big), 0), mask))
        canvas = Image.alpha_composite(canvas, layer)
        canvas.resize((size, size), Image.LANCZOS).save(PUBLIC / name, "PNG", optimize=True)
        print(f"  public/{name}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("hero");     hero_img = hero()
    print("desk");     desk()
    print("standing"); figure = standing()
    print("head");     portrait = head(figure)
    print("og");       og_image(hero_img)
    print("icons");    favicons(portrait)


if __name__ == "__main__":
    main()
