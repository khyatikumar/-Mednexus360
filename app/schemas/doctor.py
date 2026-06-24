from pydantic import BaseModel
from datetime import time


class DoctorCreate(BaseModel):
    user_id: int
    hospital_id: int
    specialization: str
    experience_years: int
    consultation_fee: float
    available_from: time
    available_to: time


class DoctorResponse(BaseModel):

    id: int

    user_id: int

    hospital_id: int

    specialization: str

    experience_years: int

    consultation_fee: float

    available_from: time

    available_to: time

    class Config:
        from_attributes = True