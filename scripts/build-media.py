"""Erzeugt web-optimierte Bilder aus den Referenzdaten und die Datei
src/content/projects.generated.js. Einmalig bzw. nach Änderungen ausführen:
    python3 scripts/build-media.py [scripts/media-manifest.json]
Benötigt Pillow."""
import json, os, re, sys, shutil
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "src", "assets")
m = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "scripts", "media-manifest.json")))
os.chdir(ROOT)  # Pfade im Manifest sind relativ zum Projektordner

FLAGSHIPS = ["eismeer-hagenbeck", "tropen-aquarium-hagenbeck", "orang-utan-dome-hagenbeck",
             "polarium-rostock", "artenschutz-aquarium-schoenbrunn", "haus-der-giganten-verona",
             "elefantenfreilaufhalle-hagenbeck", "masterplan-2030-koeln", "kaenguruhaus-hagenbeck",
             "dickhaeuterhaus-tierpark-berlin"]

def save(src, dst, long_side=2400, quality=82, fmt="JPEG"):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src)
    im.draft("RGB", (long_side * 2, long_side * 2))
    im = ImageOps.exif_transpose(im)
    if fmt == "JPEG":
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[-1]); im = bg
        im = im.convert("RGB")
    if fmt != "JPEG" and im.mode not in ("RGB", "RGBA", "L", "LA"):
        im = im.convert("RGBA" if "A" in im.mode or im.mode == "P" else "RGB")
    im.thumbnail((long_side, long_side), Image.LANCZOS)
    if fmt == "JPEG":
        im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    else:
        im.save(dst, "PNG", optimize=True)
    return im.size

if os.path.isdir(ASSETS):
    shutil.rmtree(ASSETS)

lines = ["// Automatisch erzeugt von scripts/build-media.py – nicht von Hand bearbeiten.", ""]
imports = []
counter = [0]
def imp(path):
    name = f"i{counter[0]}"
    counter[0] += 1
    rel = "@/assets/" + os.path.relpath(path, ASSETS).replace(os.sep, "/")
    imports.append(f'import {name} from "{rel}";')
    return name

def fix_scope(s):
    return (s or "").replace("Freiananlagen", "Freianlagen").replace("Freianalgen", "Freianlagen")

projects = sorted(m["projects"], key=lambda p: (FLAGSHIPS.index(p["slug"]) if p["slug"] in FLAGSHIPS else 99))
out = []
for p in projects:
    slug = p["slug"]
    files = [p["cover"]] + p["gallery"]
    imgs = []
    for i, f in enumerate(files):
        dst = os.path.join(ASSETS, "projects", slug, f"{i+1:02d}.jpg")
        save(f, dst, 2048, 80)
        place = ", ".join(x for x in [p.get("zoo"), p.get("city")] if x)
        alt = f"{p['title']}" + (f", {place}" if place else "") + (f" – Bild {i+1}" if i else "")
        imgs.append({"image": imp(dst), "alt": alt})
    out.append((p, imgs))

lines += imports + ["", "export const projects = ["]
def js(v): return json.dumps(v, ensure_ascii=False)
for p, imgs in out:
    lines.append("  {")
    for k in ["slug", "title", "zoo", "city", "country", "type", "services", "year", "facts", "text"]:
        lines.append(f"    {k}: {js(p.get(k))},")
    lines.append(f"    scope: {js(fix_scope(p.get('scope')))},")
    lines.append(f"    cover: {{ image: {imgs[0]['image']}, alt: {js(imgs[0]['alt'])} }},")
    lines.append("    gallery: [" + ", ".join(f"{{ image: {i['image']}, alt: {js(i['alt'])} }}" for i in imgs[1:]) + "],")
    lines.append("  },")
lines.append("];")
open(os.path.join(ROOT, "src/content/projects.generated.js"), "w").write("\n".join(lines) + "\n")

# Startseite
imports.clear()
hero_titles = ["Eismeer, Tierpark Hagenbeck", "Tropen-Aquarium, Tierpark Hagenbeck", "Orang-Utan-Dome, Tierpark Hagenbeck"]
hl = []
for i, f in enumerate(m["hero"]):
    dst = os.path.join(ASSETS, "home", f"hero-{i+1}.jpg"); save(f, dst, 2560, 80)
    hl.append(f'{{ image: {imp(dst)}, alt: {js(hero_titles[i])}, title: {js(hero_titles[i])} }}')
dst = os.path.join(ASSETS, "home", "competence.jpg"); save(m["competence"], dst, 2560, 80)
comp = imp(dst)
media = ["// Automatisch erzeugt von scripts/build-media.py.", ""] + imports + ["",
    "export const homeMedia = {", "  hero: [" + ", ".join(hl) + "],",
    f'  competence: {{ image: {comp}, alt: "Polarium, Zoologischer Garten Rostock" }},', "};", ""]

# Team & Partner
imports.clear()
team = []
for t in m["team"]:
    if "Platzhalter" in t["nameGuess"]: continue
    base = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(os.path.basename(t["file"]))[0].lower()).strip("-")
    dst = os.path.join(ASSETS, "team", base + ".jpg"); save(t["file"], dst, 1600, 80)
    team.append(f'  {{ file: "{base}", image: {imp(dst)} }},')
partners = []
for t in m["partners"]:
    base = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(os.path.basename(t["file"]))[0].lower()).strip("-")
    dst = os.path.join(ASSETS, "partners", base + ".png"); save(t["file"], dst, 700, fmt="PNG")
    partners.append(f'  {{ file: "{base}", name: {js(t["nameGuess"])}, image: {imp(dst)} }},')
media += imports + ["", "export const teamPhotos = ["] + team + ["];", "", "export const partnerLogos = ["] + partners + ["];"]
open(os.path.join(ROOT, "src/content/media.js"), "w").write("\n".join(media) + "\n")
print("projects", len(out))
