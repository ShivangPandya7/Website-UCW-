"""Stamp every local stylesheet and script with a version, so browsers and hosts never serve an old copy.

Run this once before each release (after you change anything under assets/):

    python tools/bump_version.py            # version = current date and time
    python tools/bump_version.py 2026-11-01 # or choose your own

It rewrites  href="assets/css/x.css"  ->  href="assets/css/x.css?v=VERSION"  in every page,
the same for scripts, and the @import lines inside assets/css. Content files (content/*.json) are
already fetched fresh every time, so they need nothing.
"""
import glob, os, re, sys, datetime

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
version = sys.argv[1] if len(sys.argv) > 1 else datetime.datetime.now().strftime('%Y%m%d%H%M')

def read(p):
    with open(p, encoding='utf8', newline='') as f: return f.read()
def write(p, t):
    with open(p, 'w', encoding='utf8', newline='') as f: f.write(t)

ref = re.compile(r'((?:href|src)=")(assets/(?:css|js)/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?(")')
imp = re.compile(r'(@import url\(")([^"?]+\.css)(?:\?v=[^"]*)?("\))')
changed = 0
pages = [p for p in glob.glob(os.path.join(root, '*.html')) if not os.path.basename(p).startswith('uppercrust-preview')]
for p in pages:
    t = read(p); n = ref.sub(lambda m: m.group(1) + m.group(2) + '?v=' + version + m.group(3), t)
    if n != t: write(p, n); changed += 1
for p in glob.glob(os.path.join(root, 'assets', 'css', '**', '*.css'), recursive=True):
    t = read(p); n = imp.sub(lambda m: m.group(1) + m.group(2) + '?v=' + version + m.group(3), t)
    if n != t: write(p, n); changed += 1
print('version', version, '- files updated:', changed)
