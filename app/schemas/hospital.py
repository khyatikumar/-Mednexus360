from pydantic import BaseModel


class HospitalCreate(BaseModel):
    name: str
    address: str
    city: str


class HospitalResponse(BaseModel):
    id: int
    name: str
    address: str
    city: str
    rating: float

    class Config:
        from_attributes = True