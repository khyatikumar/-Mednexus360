from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime, UTC

from sqlalchemy.orm import relationship

from app.db.database import Base


class LabTest(Base):

    __tablename__ = "lab_tests"

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

    test_name = Column(String)

    status = Column(
        String,
        default="pending"
    )

    result = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )

    patient = relationship("Patient")

    doctor = relationship("Doctor")