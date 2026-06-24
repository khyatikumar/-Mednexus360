from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship

from datetime import datetime,UTC

from app.db.database import Base


class MedicalRecord(Base):

    __tablename__ = "medical_records"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("patients.id")
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id")
    )

    diagnosis = Column(String)

    prescription = Column(String)

    notes = Column(String)

    created_at = Column(
    DateTime,
    nullable=False,
    default=lambda: datetime.now(UTC)
)
    patient = relationship(
        "Patient",
        back_populates="medical_records"
    )

    doctor = relationship(
        "Doctor",
        back_populates="medical_records"
    )