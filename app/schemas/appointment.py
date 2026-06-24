from pydantic import BaseModel
from datetime import datetime


class AppointmentCreate(BaseModel):

    patient_id: int

    doctor_id: int

    appointment_time: datetime


class AppointmentResponse(BaseModel):

    id: int

    patient_id: int

    doctor_id: int

    appointment_time: datetime

    status: str

    class Config:
        from_attributes = True