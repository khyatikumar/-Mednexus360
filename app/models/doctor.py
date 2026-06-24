from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Float
from sqlalchemy import Time

from sqlalchemy.orm import relationship

from app.db.database import Base


class Doctor(Base):

    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )

    hospital_id = Column(
        Integer,
        ForeignKey("hospitals.id")
    )

    specialization = Column(
        String,
        nullable=False
    )

    experience_years = Column(
        Integer,
        default=0
    )

    consultation_fee = Column(
        Float,
        default=0
    )

    available_from = Column(Time)

    available_to = Column(Time)

    user = relationship("User")

    hospital = relationship(
        "Hospital",
        back_populates="doctors"
    )
    medical_records = relationship(
    "MedicalRecord",
    back_populates="doctor"
)