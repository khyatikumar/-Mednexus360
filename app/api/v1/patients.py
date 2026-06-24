from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.core.rbac import require_role
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.appointment import Appointment
from app.models.patient import Patient

from app.schemas.patient import (
    PatientCreate,
    PatientResponse
)

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role(["PATIENT"])
    )
):

    new_patient = Patient(
        user_id=patient.user_id,
        age=patient.age,
        gender=patient.gender,
        blood_group=patient.blood_group,
        emergency_contact=patient.emergency_contact
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


@router.get("/", response_model=list[PatientResponse])
def get_patients(
    db: Session = Depends(get_db)
):

    patients = db.query(Patient).all()

    return patients


@router.get("/{patient_id}",
            response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@router.put("/{patient_id}")
def update_patient(
    patient_id: int,
    patient_data: PatientCreate,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    patient.user_id = patient_data.user_id
    patient.age = patient_data.age
    patient.gender = patient_data.gender
    patient.blood_group = patient_data.blood_group
    patient.emergency_contact = patient_data.emergency_contact

    db.commit()

    return {
        "message": "Patient updated successfully"
    }
    
    
@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    db.delete(patient)

    db.commit()

    return {
        "message": "Patient deleted successfully"
    }    
    
@router.get("/{patient_id}/dashboard")
def patient_dashboard(
    patient_id: int,
    db: Session = Depends(get_db)
):

    total = db.query(
        Appointment
    ).filter(
        Appointment.patient_id == patient_id
    ).count()

    scheduled = db.query(
        Appointment
    ).filter(
        Appointment.patient_id == patient_id,
        Appointment.status == "scheduled"
    ).count()

    completed = db.query(
        Appointment
    ).filter(
        Appointment.patient_id == patient_id,
        Appointment.status == "completed"
    ).count()

    cancelled = db.query(
        Appointment
    ).filter(
        Appointment.patient_id == patient_id,
        Appointment.status == "cancelled"
    ).count()

    return {
        "total_appointments": total,
        "scheduled": scheduled,
        "completed": completed,
        "cancelled": cancelled
    }    
    
    
@router.get("/search/")
def search_patients(
    gender: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Patient)

    if gender:
        query = query.filter(
            Patient.gender == gender
        )

    return query.all()    