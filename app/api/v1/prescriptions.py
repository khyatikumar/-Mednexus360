from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.prescription import Prescription
from app.models.patient import Patient
from app.models.doctor import Doctor

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionResponse
)

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
)


@router.post(
    "/",
    response_model=PrescriptionResponse
)
def create_prescription(
    prescription: PrescriptionCreate,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == prescription.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    doctor = db.query(Doctor).filter(
        Doctor.id == prescription.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    new_prescription = Prescription(
        patient_id=prescription.patient_id,
        doctor_id=prescription.doctor_id,
        medicines=prescription.medicines,
        dosage=prescription.dosage,
        instructions=prescription.instructions
    )

    db.add(new_prescription)

    db.commit()

    db.refresh(new_prescription)

    return new_prescription


@router.get(
    "/",
    response_model=list[PrescriptionResponse]
)
def get_prescriptions(
    db: Session = Depends(get_db)
):

    return db.query(
        Prescription
    ).all()