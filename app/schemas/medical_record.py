from pydantic import BaseModel
from datetime import datetime


class MedicalRecordCreate(BaseModel):

    patient_id: int

    doctor_id: int

    diagnosis: str

    prescription: str

    notes: str


class MedicalRecordResponse(BaseModel):

    id: int

    patient_id: int

    doctor_id: int

    diagnosis: str

    prescription: str

    notes: str
    
    created_at: datetime

    class Config:
        from_attributes = True