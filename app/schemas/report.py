from pydantic import BaseModel
from datetime import datetime


class ReportResponse(BaseModel):

    id: int

    patient_id: int

    report_name: str

    file_path: str

    uploaded_at: datetime

    class Config:
        from_attributes = True