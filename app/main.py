from fastapi import FastAPI

from app.db.database import Base, engine

# Models
from app.models.user import User
from app.models.hospital import Hospital
import app.models

# Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.hospitals import router as hospital_router
from app.api.v1.appointments import router as appointment_router
from app.api.v1.doctors import router as doctor_router
from app.api.v1.patients import router as patient_router
from app.api.v1.hospitals import router as hospital_router
from app.api.v1.medical_records import router as medical_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.symptom_checker import (
    router as symptom_router
)
from app.api.v1 import doctor_recommendation
from app.api.v1 import medical_records
from app.api.v1.prescriptions import router as prescription_router
from app.api.v1.lab_tests import router as lab_test_router
from app.api.v1.reports import router as report_router
# from app.api.v1.report_analysis import (
#     router as report_analysis_router
# )
from app.api.v1.notifications import (
    router as notification_router
)
from fastapi.exceptions import (
    RequestValidationError
)

from app.core.exceptions import (
    validation_exception_handler
)
from app.core.exceptions import (
    validation_exception_handler,
    not_found_handler,
    unauthorized_handler,
    forbidden_handler
)

from app.core.custom_exceptions import (
    NotFoundException,
    UnauthorizedException,
    ForbiddenException
)


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MedNexus 360",
    version="1.0.0"
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mednexus360.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from app.core.logger import logger

logger.info("Application Started")

# Register routers
app.include_router(auth_router)
app.include_router(hospital_router)
app.include_router(appointment_router)
app.include_router(doctor_router)
app.include_router(patient_router)
app.include_router(hospital_router)
app.include_router(medical_router)
app.include_router(dashboard_router)
app.include_router(
    symptom_router
)
app.include_router(
    doctor_recommendation.router
)
app.include_router(
    medical_records.router
)
app.include_router(
    prescription_router
)
app.include_router(
    lab_test_router
)
app.include_router(
    report_router
)
# app.include_router(
#     report_analysis_router
# )
app.include_router(
    notification_router
)
app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)
app.add_exception_handler(
    NotFoundException,
    not_found_handler
)

app.add_exception_handler(
    UnauthorizedException,
    unauthorized_handler
)

app.add_exception_handler(
    ForbiddenException,
    forbidden_handler
)

@app.get("/")
def root():
    return {
        "message": "Welcome to MedNexus 360"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }