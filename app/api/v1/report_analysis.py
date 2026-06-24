from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.report import Report

from app.schemas.report_analysis import (
    ReportAnalysisResponse
)

from app.services.report_analyzer import (
    analyze_report
)

router = APIRouter(
    prefix="/report-analysis",
    tags=["AI Report Analysis"]
)


@router.post(
    "/{report_id}",
    response_model=ReportAnalysisResponse
)
def analyze_uploaded_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = db.query(
        Report
    ).filter(
        Report.id == report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    result = analyze_report(
        report.file_path
    )

    return {
        "analysis": result
    }