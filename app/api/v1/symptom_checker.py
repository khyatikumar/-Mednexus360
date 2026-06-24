from fastapi import APIRouter

from app.schemas.symptom_checker import (
    SymptomRequest,
    SymptomResponse
)

from app.services.ai_service import (
    analyze_symptoms
)

router = APIRouter(
    prefix="/symptom-checker",
    tags=["AI Symptom Checker"]
)


@router.post(
    "/",
    response_model=SymptomResponse
)
def symptom_checker(
    request: SymptomRequest
):

    return analyze_symptoms(
        request.symptoms
    )