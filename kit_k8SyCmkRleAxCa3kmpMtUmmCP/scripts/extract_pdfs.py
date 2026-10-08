#!/usr/bin/env python3
import os
import json
from pathlib import Path

try:
    from pypdf import PdfReader
except Exception:
    PdfReader = None

FILES_DIR = Path(__file__).resolve().parent.parent / 'files'
OUTPUT_JSON = Path(__file__).resolve().parent.parent / 'files' / 'extracted_categorized.json'

def extract_text(path):
    if PdfReader is None:
        raise RuntimeError('pypdf not installed')
    text_parts = []
    reader = PdfReader(str(path))
    for page in reader.pages:
        try:
            text = page.extract_text()
        except Exception:
            text = ''
        if text:
            text_parts.append(text)
    return '\n'.join(text_parts)


def categorize_text(text):
    t = text.lower()
    cats = []
    if any(k in t for k in ['טיס', 'טיסה', 'מראה', 'נחיתה', 'pnr', 'flight', 'airline', 'flight number']):
        cats.append('flights')
    if any(k in t for k in ['מלון', 'hotel', 'check-in', 'checkin', 'לינה']):
        cats.append('hotels')
    if any(k in t for k in ['itinerary', 'מסלול', 'לוח זמנים', 'תאריך', 'day', 'תכנית']):
        cats.append('itinerary')
    if not cats:
        cats.append('other')
    return cats


def main():
    results = {}
    if not FILES_DIR.exists():
        print('files folder not found:', FILES_DIR)
        return
    for p in sorted(FILES_DIR.iterdir()):
        if p.suffix.lower() != '.pdf':
            continue
        print('Processing', p.name)
        try:
            text = extract_text(p)
        except Exception as e:
            text = f'ERROR extracting: {e}'
        cats = categorize_text(text)
        results[p.name] = {
            'categories': cats,
            'text': text[:20000]
        }

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print('Wrote', OUTPUT_JSON)

if __name__ == '__main__':
    main()
