from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.core.rbac import require_role
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from fastapi import Query
from datetime import time

from app.schemas.doctor import (
    DoctorCreate,
    DoctorResponse
)

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)


@router.post("/", response_model=DoctorResponse)
def create_doctor(
    doctor: DoctorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role(["HOSPITAL_ADMIN"])
    )
):

    new_doctor = Doctor(
    user_id=doctor.user_id,
    hospital_id=doctor.hospital_id,
    specialization=doctor.specialization,
    experience_years=doctor.experience_years,
    consultation_fee=doctor.consultation_fee,
    available_from=doctor.available_from,
    available_to=doctor.available_to
)

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return new_doctor


@router.get("/", response_model=list[DoctorResponse])
def get_doctors(
    db: Session = Depends(get_db)
):

    doctors = db.query(Doctor).all()

    return doctors


@router.get("/{doctor_id}",
            response_model=DoctorResponse)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    return doctor


@router.put("/{doctor_id}")
def update_doctor(
    doctor_id: int,
    doctor_data: DoctorCreate,
    db: Session = Depends(get_db)
):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    doctor.user_id = doctor_data.user_id
    doctor.hospital_id = doctor_data.hospital_id
    doctor.specialization = doctor_data.specialization
    doctor.experience_years = doctor_data.experience_years

    db.commit()

    return {
        "message": "Doctor updated successfully"
    }
    
    
    
@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    db.delete(doctor)

    db.commit()

    return {
        "message": "Doctor deleted successfully"
    }    
    
    
@router.get("/search/")
def search_doctors(
    specialization: str,
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).filter(
        Doctor.specialization.ilike(
            f"%{specialization}%"
        )
    ).all()

    return doctors    

@router.get("/{doctor_id}/dashboard")
def doctor_dashboard(
    doctor_id: int,
    db: Session = Depends(get_db)
):

    total = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id
    ).count()

    scheduled = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == "scheduled"
    ).count()

    completed = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == "completed"
    ).count()

    cancelled = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == "cancelled"
    ).count()

    return {
        "total_appointments": total,
        "scheduled": scheduled,
        "completed": completed,
        "cancelled": cancelled
    }
    
@router.get("/specialization/{specialization}")
def get_doctors_by_specialization(
    specialization: str,
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).filter(
        Doctor.specialization == specialization
    ).all()

    return doctors

@router.get("/hospital/{hospital_id}")
def get_doctors_by_hospital(
    hospital_id: int,
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).filter(
        Doctor.hospital_id == hospital_id
    ).all()

    return doctors


@router.get("/experienced/{years}")
def experienced_doctors(
    years: int,
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).filter(
        Doctor.experience_years >= years
    ).all()

    return doctors    

@router.get(
    "/specialization/{specialization}"
)
def doctors_by_specialization(
    specialization: str,
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).filter(
        Doctor.specialization
        == specialization
    ).all()

    return doctors

@router.get("/search/")
def search_doctors(
    specialization: str | None = None,
    hospital_id: int | None = None,
    min_experience: int | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Doctor)

    if specialization:
        query = query.filter(
            Doctor.specialization.ilike(
                f"%{specialization}%"
            )
        )

    if hospital_id:
        query = query.filter(
            Doctor.hospital_id == hospital_id
        )

    if min_experience:
        query = query.filter(
            Doctor.experience_years >= min_experience
        )

    doctors = query.all()

    return doctors


@router.get("/paginated/")
def get_doctors_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db)
):

    skip = (page - 1) * limit

    total = db.query(
        Doctor
    ).count()

    doctors = db.query(
        Doctor
    ).offset(skip).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": doctors
    }
    
@router.get("/sorted/")
def get_sorted_doctors(
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).order_by(
        Doctor.experience_years.desc()
    ).all()

    return doctors    


@router.get("/available/")
def available_doctors(
    db: Session = Depends(get_db)
):

    doctors = db.query(
        Doctor
    ).all()

    return doctors