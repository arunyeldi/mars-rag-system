from pathlib import Path
from loader import load_pdf

PDF_PATH = "data/raw/mars_report.pdf"

text = load_pdf(PDF_PATH)

output_path = (
    Path("data/processed")
    / "mars_report.txt"
)

output_path.write_text(
    text,
    encoding="utf-8"
)

print("Text extraction completed")