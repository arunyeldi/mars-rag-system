from pathlib import Path


def build_metadata(pdf_path: str):
    file = Path(pdf_path)

    return {
        "filename": file.name,
        "source": str(file),
        "size_mb": round(
            file.stat().st_size / (1024 * 1024),
            2
        )
    }