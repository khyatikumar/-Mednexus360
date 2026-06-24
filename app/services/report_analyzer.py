from pypdf import PdfReader

from app.services.ai_service import (
    analyze_symptoms
)


def extract_pdf_text(
    file_path: str
):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        text += page.extract_text()

    return text


def analyze_report(
    file_path: str
):

    report_text = extract_pdf_text(
        file_path
    )

    return analyze_symptoms(
        report_text
    )