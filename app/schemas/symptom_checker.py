from pydantic import BaseModel


class SymptomRequest(BaseModel):

    symptoms: str


class SymptomResponse(BaseModel):

    possible_conditions: list[str]

    recommended_specialist: str

    urgency_level: str