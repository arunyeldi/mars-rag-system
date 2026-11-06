# import pymupdf

# doc = pymupdf.open("data/raw/mars_report.pdf")

# page = doc[0]

# text = page.get_text()

# print("Characters:", len(text))
# print(text[:500])

from loader import load_pdf

text = load_pdf("data/raw/mars_report.pdf")

print("Length of extracted text:", len(text))
print("Content:")
print(repr(text[:500]))