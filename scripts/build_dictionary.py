"""Extract noun articles from german-nouns CSV, using only stdlib."""
import csv
import json
import sys
import unicodedata
from pathlib import Path

SOURCE_COMMIT = 'da71a2bc519b952b28c9b0b80971cff6efb508f6'
SOURCE_URL = f'https://raw.githubusercontent.com/gambolputty/german-nouns/{SOURCE_COMMIT}/german_nouns/nouns.csv'
OUTPUT = Path(__file__).resolve().parents[1] / 'data' / 'nouns.json'


def build(source):
    nouns = {}
    with open(source, encoding='utf-8', newline='') as stream:
        for row in csv.DictReader(stream):
            parts = row['pos'].split(',')
            if 'Substantiv' not in parts or any(part in parts for part in
                    ('Affix', 'Suffix', 'Präfix', 'Gebundenes Lexem')):
                continue
            title = unicodedata.normalize('NFC', row['lemma']).strip()
            mask = 0
            for key, value in row.items():
                if key.startswith('genus'):
                    mask |= {'m': 1, 'f': 2, 'n': 4}.get(value, 0)
            if not mask and parts == ['Substantiv']:
                singular = any(value for key, value in row.items()
                               if key.startswith('nominativ singular'))
                plural = any(value for key, value in row.items()
                             if key.startswith('nominativ plural'))
                if plural and not singular:
                    mask = 8
            if title and mask:
                nouns[title] = nouns.get(title, 0) | mask
    entries = [[title, mask] for title, mask in sorted(nouns.items())]
    OUTPUT.write_text(json.dumps(entries, ensure_ascii=False, separators=(',', ':')) + '\n',
                      encoding='utf-8')
    print(f'{len(entries):,} nouns; {OUTPUT.stat().st_size:,} bytes')


if __name__ == '__main__':
    build(sys.argv[1])
