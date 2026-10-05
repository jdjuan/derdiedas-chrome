"""Build a Chrome Web Store archive containing only extension runtime files."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'manifest.json').read_text())['version']
output = root / 'dist' / f'derdiedas-{version}.zip'
output.parent.mkdir(exist_ok=True)
files = [root / name for name in ('manifest.json', 'popup.html', 'popup.js', 'dictionary.js', 'background.js')]
files += sorted((root / 'images').glob('*'))
files += [root / 'data' / name for name in ('nouns.json', 'ATTRIBUTION.txt', 'LICENSE.txt')]
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for file in files:
        archive.write(file, file.relative_to(root))
with ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'manifest.json' in archive.namelist()
print(f'{output} ({output.stat().st_size:,} bytes)')
