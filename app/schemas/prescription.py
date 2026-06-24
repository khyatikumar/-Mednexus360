from pydantic import BaseModel
from datetime import datetime


class PrescriptionCreate(BaseModel):

    patient_id: int

    doctor_id: int

    medicines: str

    dosage: str

    instructions: str


class PrescriptionResponse(
    PrescriptionCreate
):

    id: int

    created_at: datetime

    class Config:
        from_attributes = True