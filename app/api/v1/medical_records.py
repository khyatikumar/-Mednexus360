from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.medical_record import MedicalRecord

from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordResponse
)

router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"]
)


@router.post(
    "/",
    response_model=MedicalRecordResponse
)
def create_record(
    record: MedicalRecordCreate,
    db: Session = Depends(get_db)
):

    new_record = MedicalRecord(
        patient_id=record.patient_id,
        doctor_id=record.doctor_id,
        diagnosis=record.diagnosis,
        prescription=record.prescription,
        notes=record.notes
    )

    db.add(new_record)

    db.commit()

    db.refresh(new_record)

    return new_record


@router.get(
    "/",
    response_model=list[MedicalRecordResponse]
)
def get_records(
    db: Session = Depends(get_db)
):

    return db.query(
        MedicalRecord
    ).all()


@router.get(
    "/patient/{patient_id}",
    response_model=list[MedicalRecordResponse]
)
def patient_records(
    patient_id: int,
    db: Session = Depends(get_db)
):

    return db.query(
        MedicalRecord
    ).filter(
        MedicalRecord.patient_id == patient_id
    ).all()