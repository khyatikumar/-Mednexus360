from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

from app.db.database import Base

class Hospital(Base):

    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    address = Column(String)

    city = Column(String)

    rating = Column(Float, default=0.0)

    doctors = relationship(
        "Doctor",
        back_populates="hospital"
    )