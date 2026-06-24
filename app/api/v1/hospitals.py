from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.dependencies import get_db
from app.dependencies import get_current_user
from app.core.rbac import require_role
from app.models.hospital import Hospital

from app.schemas.hospital import (
    HospitalCreate,
    HospitalResponse
)

router = APIRouter(
    prefix="/hospitals",
    tags=["Hospitals"]
)


# CREATE HOSPITAL
@router.post("/", response_model=HospitalResponse)
def create_hospital(
    hospital: HospitalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role(["HOSPITAL_ADMIN"])
    )
):

    new_hospital = Hospital(
        name=hospital.name,
        address=hospital.address,
        city=hospital.city
    )

    db.add(new_hospital)
    db.commit()
    db.refresh(new_hospital)

    return new_hospital

# GET ALL HOSPITALS
@router.get("/", response_model=list[HospitalResponse])
def get_hospitals(
    db: Session = Depends(get_db)
):

    hospitals = db.query(Hospital).all()

    return hospitals


# GET SINGLE HOSPITAL
@router.get("/{hospital_id}",
            response_model=HospitalResponse)
def get_hospital(
    hospital_id: int,
    db: Session = Depends(get_db)
):

    hospital = db.query(Hospital).filter(
        Hospital.id == hospital_id
    ).first()

    if not hospital:
        raise HTTPException(
            status_code=404,
            detail="Hospital not found"
        )

    return hospital


# UPDATE HOSPITAL
@router.put("/{hospital_id}")
def update_hospital(
    hospital_id: int,
    hospital_data: HospitalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role(["HOSPITAL_ADMIN"])
    )
):

    hospital = db.query(Hospital).filter(
        Hospital.id == hospital_id
    ).first()

    if not hospital:
        raise HTTPException(
            status_code=404,
            detail="Hospital not found"
        )

    hospital.name = hospital_data.name
    hospital.address = hospital_data.address
    hospital.city = hospital_data.city

    db.commit()

    return {
        "message": "Hospital updated successfully"
    }


# DELETE HOSPITAL
@router.delete("/{hospital_id}")
def delete_hospital(
    hospital_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role(["HOSPITAL_ADMIN"])
    )
):

    hospital = db.query(Hospital).filter(
        Hospital.id == hospital_id
    ).first()

    if not hospital:
        raise HTTPException(
            status_code=404,
            detail="Hospital not found"
        )

    db.delete(hospital)
    db.commit()

    return {
        "message": "Hospital deleted successfully"
    }
    
@router.get("/search/")
def search_hospitals(
    city: str,
    db: Session = Depends(get_db)
):

    hospitals = db.query(
        Hospital
    ).filter(
        Hospital.city.ilike(
            f"%{city}%"
        )
    ).all()

    return hospitals    


@router.get("/admin/dashboard")
def hospital_dashboard(
    db: Session = Depends(get_db)
):

    total_hospitals = db.query(
        Hospital
    ).count()

    total_doctors = db.query(
        Doctor
    ).count()

    total_patients = db.query(
        Patient
    ).count()

    total_appointments = db.query(
        Appointment
    ).count()

    return {
        "hospitals": total_hospitals,
        "doctors": total_doctors,
        "patients": total_patients,
        "appointments": total_appointments
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