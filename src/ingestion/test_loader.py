import pymupdf

doc = pymupdf.open("data/raw/mars_report.pdf")

page = doc[0]

text = page.get_text()

print("Characters:", len(text))
print(text[:500])