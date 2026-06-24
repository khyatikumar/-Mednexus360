from pydantic import BaseModel
from datetime import datetime


class LabTestCreate(BaseModel):

    patient_id: int

    doctor_id: int

    test_name: str


class LabTestResponse(BaseModel):

    id: int

    patient_id: int

    doctor_id: int

    test_name: str

    status: str

    result: str | None

    created_at: datetime

    class Config:
        from_attributes = True


class LabResultUpdate(BaseModel):

    result: str