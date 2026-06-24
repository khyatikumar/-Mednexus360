from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.doctor import Doctor

from app.schemas.doctor_recommendation import (
    DoctorRecommendationRequest,
    DoctorRecommendationResponse
)

from app.services.ai_service import (
    get_specialist
)

router = APIRouter(
    prefix="/doctor-recommendation",
    tags=["AI Recommendation"]
)


@router.post(
    "/",
    response_model=DoctorRecommendationResponse
)
def recommend_doctor(
    request: DoctorRecommendationRequest,
    db: Session = Depends(get_db)
):

    specialist = get_specialist(
        request.symptoms
    )

    doctors = db.query(
        Doctor
    ).filter(
        Doctor.specialization.ilike(
            f"%{specialist}%"
        )
    ).all()

    return {
        "recommended_specialist": specialist,
        "doctors": doctors
    }