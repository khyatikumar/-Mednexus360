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
import uuid


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


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

    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
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
        report_name=file.filename,   # Original filename shown to users
        file_path=file_path          # Actual stored path
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