from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy import String

from sqlalchemy.orm import relationship

from app.db.database import Base


class Appointment(Base):

    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id")
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id")
    )

    appointment_time = Column(DateTime)

    status = Column(
        String,
        default="scheduled"
    )

    patient = relationship("Patient")

    doctor = relationship("Doctor")