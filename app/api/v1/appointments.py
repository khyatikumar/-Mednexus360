from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse
)
from app.services.notification_service import (
    create_notification
)

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


@router.post(
    "/",
    response_model=AppointmentResponse
)
def create_appointment(
    appointment: AppointmentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check Patient
    patient = db.query(Patient).filter(
        Patient.id == appointment.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # Check Doctor
    doctor = db.query(Doctor).filter(
        Doctor.id == appointment.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    # Check Doctor Availability
    appointment_clock = (
        appointment.appointment_time.time()
    )

    if (
        appointment_clock < doctor.available_from
        or
        appointment_clock > doctor.available_to
    ):
        raise HTTPException(
            status_code=400,
            detail="Doctor unavailable at this time"
        )

    # Check Double Booking
    existing_appointment = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id
        == appointment.doctor_id,

        Appointment.appointment_time
        == appointment.appointment_time,

        Appointment.status
        == "scheduled"
    ).first()

    if existing_appointment:
        raise HTTPException(
            status_code=400,
            detail="Doctor already booked"
        )
    
    
    # Check Patient Double Booking
    patient_conflict = db.query(
    Appointment
).filter(
    Appointment.patient_id
    == appointment.patient_id,

    Appointment.appointment_time
    == appointment.appointment_time,

    Appointment.status
    == "scheduled"
).first()

    if patient_conflict:
     raise HTTPException(
        status_code=400,
        detail="Patient already has an appointment at this time"
    )
    # Create Appointment
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        status="scheduled"
    )

    db.add(new_appointment)

    db.commit()

    db.refresh(new_appointment)
    
    background_tasks.add_task(
    create_notification,
    db,
    patient.user_id,
    "Appointment Confirmed",
    f"Appointment booked with Doctor ID {doctor.id}"
)

    return new_appointment


@router.get(
    "/",
    response_model=list[AppointmentResponse]
)
def get_appointments(
    db: Session = Depends(get_db)
):

    return db.query(
        Appointment
    ).all()


@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse
)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = db.query(
        Appointment
    ).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    return appointment


@router.put(
    "/{appointment_id}/cancel"
)
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = db.query(
        Appointment
    ).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    appointment.status = "cancelled"

    db.commit()

    return {
        "message": "Appointment cancelled"
    }


@router.put(
    "/{appointment_id}/complete"
)
def complete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = db.query(
        Appointment
    ).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    appointment.status = "completed"

    db.commit()

    return {
        "message": "Appointment completed"
    }


@router.get(
    "/doctor/{doctor_id}"
)
def doctor_appointments(
    doctor_id: int,
    db: Session = Depends(get_db)
):

    appointments = db.query(
        Appointment
    ).filter(
        Appointment.doctor_id == doctor_id
    ).all()

    return appointments


@router.get(
    "/patient/{patient_id}"
)
def patient_appointments(
    patient_id: int,
    db: Session = Depends(get_db)
):

    appointments = db.query(
        Appointment
    ).filter(
        Appointment.patient_id == patient_id
    ).all()

    return appointments


@router.get("/filter/")
def filter_appointments(
    status: str,
    db: Session = Depends(get_db)
):

    appointments = db.query(
        Appointment
    ).filter(
        Appointment.status == status
    ).all()

    return appointments