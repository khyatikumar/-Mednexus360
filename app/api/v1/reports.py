from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.patient import Patient
from app.models.report import Report

from app.schemas.report import ReportResponse

import shutil
import os


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post(
    "/upload/{patient_id}",
    response_model=ReportResponse
)
def upload_report(
    patient_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    patient = db.query(
        Patient
    ).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    file_path = (
        f"uploads/{file.filename}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    report = Report(
        patient_id=patient_id,
        report_name=file.filename,
        file_path=file_path
    )

    db.add(report)

    db.commit()

    db.refresh(report)

    return report


@router.get(
    "/patient/{patient_id}",
    response_model=list[ReportResponse]
)
def patient_reports(
    patient_id: int,
    db: Session = Depends(get_db)
):

    return db.query(
        Report
    ).filter(
        Report.patient_id == patient_id
    ).all()