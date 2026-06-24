from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime, UTC

from sqlalchemy.orm import relationship

from app.db.database import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("patients.id")
    )

    report_name = Column(String)

    file_path = Column(String)

    uploaded_at = Column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )

    patient = relationship("Patient")