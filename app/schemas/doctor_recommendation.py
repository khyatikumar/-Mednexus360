from pydantic import BaseModel


class DoctorRecommendationRequest(BaseModel):
    symptoms: str


class RecommendedDoctor(BaseModel):
    id: int
    specialization: str
    experience_years: int


class DoctorRecommendationResponse(BaseModel):
    recommended_specialist: str
    doctors: list[RecommendedDoctor]