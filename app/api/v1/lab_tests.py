from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.lab_test import LabTest
from app.models.patient import Patient
from app.models.doctor import Doctor

from app.schemas.lab_test import (
    LabTestCreate,
    LabTestResponse,
    LabResultUpdate
)

router = APIRouter(
    prefix="/lab-tests",
    tags=["Lab Tests"]
)

@router.post(
    "/",
    response_model=LabTestResponse
)
def create_lab_test(
    test: LabTestCreate,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == test.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    doctor = db.query(Doctor).filter(
        Doctor.id == test.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    new_test = LabTest(
        patient_id=test.patient_id,
        doctor_id=test.doctor_id,
        test_name=test.test_name
    )

    db.add(new_test)

    db.commit()

    db.refresh(new_test)

    return new_test


@router.get(
    "/",
    response_model=list[LabTestResponse]
)
def get_lab_tests(
    db: Session = Depends(get_db)
):

    return db.query(
        LabTest
    ).all()
    
    
@router.put(
    "/{test_id}/result"
)
def upload_result(
    test_id: int,
    data: LabResultUpdate,
    db: Session = Depends(get_db)
):

    test = db.query(
        LabTest
    ).filter(
        LabTest.id == test_id
    ).first()

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Lab test not found"
        )

    test.result = data.result

    test.status = "completed"

    db.commit()

    return {
        "message": "Result uploaded"
    }
    
    
@router.get(
    "/patient/{patient_id}"
)
def patient_tests(
    patient_id: int,
    db: Session = Depends(get_db)
):

    return db.query(
        LabTest
    ).filter(
        LabTest.patient_id == patient_id
    ).all()        