import json
from pathlib import Path

from loader import load_pdf
from chunker import chunk_text


PDF_PATH = "data/raw/mars_report.pdf"

pdf_name = Path(PDF_PATH).name

text = load_pdf(PDF_PATH)

chunks = chunk_text(text)

print(f"Created {len(chunks)} chunks")

output = []

for idx, chunk in enumerate(chunks):

    output.append(
        {
            "chunk_id": idx,
            "document": pdf_name,
            "chunk_size": len(chunk),
            "text": chunk
        }
    )

output_file = (
    Path("data/chunks")
    / "mars_chunks.json"
)

with open(
    output_file,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        output,
        f,
        indent=2,
        ensure_ascii=False
    )

print("Saved chunks successfully")