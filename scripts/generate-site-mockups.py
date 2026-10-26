"""Generate branded marketplace device mockups for every site in src/config/sites.ts."""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SITES_FILE = ROOT / "src/config/sites.ts"
PUBLIC = ROOT / "public"

WHITE = "#ffffff"
INK = "#171717"
MUTED = "#6b7280"
LINE = "#e5e7eb"
SOFT = "#f5f6f8"


def load_sites() -> list[dict[str, str]]:
    source = SITES_FILE.read_text(encoding="utf-8")
    pattern = re.compile(
        r'\{\s*key:\s*"(?P<key>[^"]+)".*?'
        r'brand:\s*"(?P<brand>[^"]+)".*?'
        r'singular:\s*"(?P<singular>[^"]+)".*?'
        r'plural:\s*"(?P<plural>[^"]+)".*?'
        r'color:\s*"(?P<color>#[0-9A-Fa-f]{6})"',
    )
    sites = []
    for line in source.splitlines():
        if "key:" not in line or "brand:" not in line:
            continue
        match = pattern.search(line)
        if match:
            sites.append(match.groupdict())
            continue
        # Most sites use the network default and therefore omit `color`.
        without_color = re.search(
            r'key:\s*"(?P<key>[^"]+)".*?'
            r'brand:\s*"(?P<brand>[^"]+)".*?'
            r'singular:\s*"(?P<singular>[^"]+)".*?'
            r'plural:\s*"(?P<plural>[^"]+)"',
            line,
        )
        if without_color:
            site = without_color.groupdict()
            site["color"] = "#4736FE"
            sites.append(site)
    if not sites:
        raise RuntimeError("No site definitions found in src/config/sites.ts")
    return sites


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    windows = Path("C:/Windows/Fonts")
    name = "arialbd.ttf" if bold else "arial.ttf"
    path = windows / name
    if not path.exists():
        path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    return ImageFont.truetype(str(path), size)


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, size: int, bold: bool = False):
    while size > 7:
        selected = font(size, bold)
        if draw.textbbox((0, 0), text, font=selected)[2] <= max_width:
            return selected
        size -= 1
    return font(7, bold)


def rounded(draw: ImageDraw.ImageDraw, box, radius=12, fill=WHITE, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def cover(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as image:
        return ImageOps.fit(image.convert("RGB"), size, method=Image.Resampling.LANCZOS)


def asset_images(site: dict[str, str]) -> list[Image.Image]:
    folder = PUBLIC / "sites" / site["key"]
    candidates = [
        folder / "seller-card.jpg",
        folder / "buyer-guide.jpg",
        folder / "details-banner.jpg",
        folder / "home-banner.jpg",
    ]
    existing = [path for path in candidates if path.exists()]
    if not existing:
        return [Image.new("RGB", (320, 180), "#e9eaed")] * 4
    return [cover(existing[index % len(existing)], (320, 180)) for index in range(4)]


def brand(canvas: Image.Image, xy, site: dict[str, str], max_width: int, max_height: int):
    logo_path = PUBLIC / "sites" / site["key"] / "logo.png"
    if logo_path.exists():
        with Image.open(logo_path) as source:
            logo = source.convert("RGBA")
        logo.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        canvas.paste(logo, (round(xy[0]), round(xy[1])), logo)
        return

    draw = ImageDraw.Draw(canvas)
    text = site["brand"]
    draw.text(xy, text, fill=INK, font=fit_font(draw, text, max_width, max_height, True))


def chip(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, scale: float, color=WHITE):
    f = font(max(8, round(12 * scale)))
    padding = round(13 * scale)
    height = round(31 * scale)
    width = draw.textbbox((0, 0), text, font=f)[2] + padding * 2
    rounded(draw, (x, y, x + width, y + height), height // 2, color, "#d7d9dd")
    draw.text((x + padding, y + round(8 * scale)), text, fill="#3f434a", font=f)
    return x + width + round(8 * scale)


def listing_card(
    canvas: Image.Image,
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    site: dict[str, str],
    image: Image.Image | None,
    index: int,
    dealer: bool,
):
    x1, y1, x2, y2 = box
    card_w = x2 - x1
    card_h = y2 - y1
    compact = card_h < 230
    very_compact = card_h < 160
    rounded(draw, box, 10, WHITE, "#dfe1e5")
    image_ratio = 0.35 if very_compact else (0.44 if compact else 0.48)
    image_h = round(card_h * image_ratio)
    if image:
        resized = ImageOps.fit(image, (card_w - 2, image_h), method=Image.Resampling.LANCZOS)
        canvas.paste(resized, (x1 + 1, y1 + 1))
    else:
        draw.rectangle((x1 + 1, y1 + 1, x2 - 1, y1 + image_h), fill="#f0f1f3")
        draw.line((x1 + 2, y1 + 2, x2 - 2, y1 + image_h), fill="#d5d7db", width=1)
        draw.line((x2 - 2, y1 + 2, x1 + 2, y1 + image_h), fill="#d5d7db", width=1)
    pad = max(6, min(11, card_w // 12))
    title_y = y1 + image_h + (4 if very_compact else (6 if compact else 10))
    title = f"{site['singular']} listing {index + 1}"
    draw.text((x1 + pad, title_y), title, fill=INK,
              font=fit_font(draw, title, card_w - pad * 2, 10 if very_compact else 13, True))
    price_y = title_y + (16 if very_compact else (20 if compact else 24))
    draw.text((x1 + pad, price_y), f"${49_990 + index * 12_500:,}",
              fill=INK, font=font(10 if very_compact else (13 if compact else 15), True))
    if not compact:
        draw.text((x1 + pad, title_y + 49), "Australia  •  Available now",
                  fill=MUTED, font=fit_font(draw, "Australia  •  Available now", card_w - pad * 2, 10))
    button_y = y2 - (29 if very_compact else (34 if compact else 38))
    button_box = (x1 + pad, button_y, x2 - pad, y2 - (5 if very_compact else (7 if compact else 9)))
    button_fill = site["color"] if dealer else WHITE
    button_outline = None if dealer else "#747b86"
    rounded(draw, button_box, 5, button_fill, button_outline)
    button = "View Details" if dealer else "Contact Seller"
    button_font = fit_font(draw, button, card_w - pad * 2 - 10, 10, True)
    button_width = draw.textbbox((0, 0), button, font=button_font)[2]
    button_color = WHITE if dealer else "#343941"
    draw.text(((x1 + x2 - button_width) // 2, button_y + (5 if very_compact else (7 if compact else 8))),
              button, fill=button_color, font=button_font)


def marketplace(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    site: dict[str, str],
    dealer: bool,
    images: list[Image.Image],
    force_compact: bool = False,
    columns: int | None = None,
):
    draw = ImageDraw.Draw(canvas)
    x1, y1, x2, y2 = box
    w, h = x2 - x1, y2 - y1
    scale = w / 760
    compact = force_compact or w < 300
    ui_scale = max(0.65, scale) if compact else scale
    draw.rectangle(box, fill=WHITE)
    header_h = round(60 * ui_scale)
    draw.line((x1, y1 + header_h, x2, y1 + header_h), fill=LINE, width=max(1, round(scale)))
    brand_width = round(w * 0.66) if compact else round(260 * scale)
    brand(canvas, (x1 + round(22 * ui_scale), y1 + round(16 * ui_scale)), site,
          brand_width, round(26 * ui_scale))
    if compact:
        menu_x = x2 - round(38 * ui_scale)
        menu_y = y1 + round(20 * ui_scale)
        for offset in (0, round(7 * ui_scale), round(14 * ui_scale)):
            draw.line((menu_x, menu_y + offset, x2 - round(14 * ui_scale), menu_y + offset),
                      fill="#404247", width=max(1, round(2 * ui_scale)))
    else:
        nav = f"Buy    Sell My {site['singular']}    Dealer Advertising"
        nav_font = fit_font(draw, nav, round(330 * scale), round(11 * scale))
        draw.text((x2 - round(350 * scale), y1 + round(23 * scale)), nav, fill="#404247", font=nav_font)

    chip_y = y1 + header_h + round(13 * ui_scale)
    cursor = x1 + round(22 * ui_scale)
    labels = ("Filters", f"{site['singular']} Type", "Location") if compact else (
        "Filters", f"{site['singular']} Type", "Location", "Condition"
    )
    for label in labels:
        next_cursor = chip(draw, cursor, chip_y, label, ui_scale)
        if next_cursor > x2 - round(8 * ui_scale):
            break
        cursor = next_cursor

    heading_y = chip_y + round(48 * ui_scale)
    heading = f"{site['plural']} for Sale in Australia"
    heading_max = w - round(44 * ui_scale)
    draw.text((x1 + round(22 * ui_scale), heading_y), heading, fill=INK,
              font=fit_font(draw, heading, heading_max, round(18 * ui_scale), True))

    cards_y = heading_y + round(38 * ui_scale)
    if compact:
        side = round(22 * ui_scale)
        gap = round(16 * ui_scale)
        available = y2 - cards_y - round(12 * ui_scale)
        count = 2 if available >= 540 else 1
        card_h = (available - gap * (count - 1)) // count
        for index in range(count):
            top = cards_y + index * (card_h + gap)
            listing_card(
                canvas, draw, (x1 + side, top, x2 - side, top + card_h),
                site, images[index] if dealer else None, index, dealer,
            )
        return

    draw.text((x2 - round(130 * scale), heading_y + round(3 * scale)), "Featured  ▾",
              fill="#4b4e55", font=font(max(8, round(11 * scale))))
    gap = round(12 * scale)
    column_count = columns or 4
    row_count = (4 + column_count - 1) // column_count
    card_w = (w - round(44 * scale) - gap * (column_count - 1)) // column_count
    available_h = y2 - cards_y - round(18 * scale)
    card_h = (available_h - gap * (row_count - 1)) // row_count
    for index in range(4):
        row, column = divmod(index, column_count)
        left = x1 + round(22 * scale) + column * (card_w + gap)
        top = cards_y + row * (card_h + gap)
        listing_card(
            canvas, draw, (left, top, left + card_w, top + card_h),
            site, images[index] if dealer else None, index, dealer,
        )


def desktop(site: dict[str, str], dealer: bool, images: list[Image.Image]) -> Image.Image:
    # Reuse the photographed CFS hardware so the monitor, laptop, tablet and
    # phone retain realistic bezels, stands, keyboards, reflections and shadows.
    with Image.open(PUBLIC / "images" / "sell-mockup-desktop.jpg") as template:
        hardware = template.convert("RGB")
        canvas = hardware.copy()

    marketplace(canvas, (333, 44, 1162, 490), site, dealer, images)
    # The tablet sits in front of the monitor. Restore its top bezel after
    # painting the monitor display so the two screens remain visually separate.
    tablet_bezel = hardware.crop((895, 462, 1299, 491))
    canvas.paste(tablet_bezel, (895, 462))
    marketplace(canvas, (99, 542, 705, 870), site, dealer, images)
    marketplace(canvas, (926, 491, 1271, 960), site, dealer, images, columns=2)
    marketplace(canvas, (1342, 561, 1479, 934), site, dealer, images)
    return canvas


def mobile(site: dict[str, str], dealer: bool, images: list[Image.Image]) -> Image.Image:
    # The original phone photo has a much finer, more realistic bezel than a
    # drawn frame. Only replace its display contents.
    with Image.open(PUBLIC / "images" / "sell-mockup-mobile.jpg") as template:
        canvas = template.convert("RGB").copy()
    marketplace(canvas, (110, 143, 745, 1717), site, dealer, images, force_compact=True)
    return canvas


def save_jpeg(image: Image.Image, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "JPEG", quality=90, optimize=True, progressive=True)


def main():
    sites = load_sites()
    for site in sites:
        images = asset_images(site)
        folder = PUBLIC / "sites" / site["key"]
        save_jpeg(desktop(site, False, images), folder / "sell-mockup-desktop.jpg")
        save_jpeg(mobile(site, False, images), folder / "sell-mockup-mobile.jpg")
        save_jpeg(desktop(site, True, images), folder / "dealer-mockup-desktop.jpg")
        save_jpeg(mobile(site, True, images), folder / "dealer-mockup-mobile.jpg")
        print(f"Generated mockups for {site['key']}")


if __name__ == "__main__":
    main()
