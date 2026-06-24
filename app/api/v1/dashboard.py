from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.medical_record import MedicalRecord
from app.models.report import Report
from app.models.user import User
from app.models.hospital import Hospital


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/hospital/{hospital_id}")
def hospital_dashboard(
    hospital_id: int,
    db: Session = Depends(get_db)
):

    total_doctors = db.query(
        Doctor
    ).filter(
        Doctor.hospital_id == hospital_id
    ).count()

    total_patients = db.query(
        Patient
    ).count()

    total_appointments = db.query(
        Appointment
    ).count()

    completed = db.query(
        Appointment
    ).filter(
        Appointment.status == "completed"
    ).count()

    cancelled = db.query(
        Appointment
    ).filter(
        Appointment.status == "cancelled"
    ).count()

    return {
        "hospital_id": hospital_id,
        "total_doctors": total_doctors,
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "completed_appointments": completed,
        "cancelled_appointments": cancelled
    }
    
@router.get("/doctor/{doctor_id}")
def doctor_dashboard(
    doctor_id: int,
    db: Session = Depends(get_db)
):

    total = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id
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

    scheduled = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == "scheduled"
    ).count()

    return {
        "doctor_id": doctor_id,
        "total_appointments": total,
        "completed": completed,
        "cancelled": cancelled,
        "scheduled": scheduled
    }
    
@router.get("/patient/{patient_id}")
def patient_dashboard(
    patient_id: int,
    db: Session = Depends(get_db)
):

    appointments = db.query(
        Appointment
    ).filter(
        Appointment.patient_id == patient_id
    ).count()

    records = db.query(
        MedicalRecord
    ).filter(
        MedicalRecord.patient_id == patient_id
    ).count()

    reports = db.query(
        Report
    ).filter(
        Report.patient_id == patient_id
    ).count()

    return {
        "patient_id": patient_id,
        "appointments": appointments,
        "medical_records": records,
        "reports": reports
    }    
    
@router.get("/stats")
def system_stats(
    db: Session = Depends(get_db)
):

    return {
        "users": db.query(User).count(),
        "hospitals": db.query(Hospital).count(),
        "doctors": db.query(Doctor).count(),
        "patients": db.query(Patient).count(),
        "appointments": db.query(Appointment).count()
    }    