from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.db.database import Base


class Patient(Base):

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )

    age = Column(Integer)

    gender = Column(String)

    blood_group = Column(String)

    emergency_contact = Column(String)

    user = relationship("User")
    
    
    medical_records = relationship(
    "MedicalRecord",
    back_populates="patient"
)  