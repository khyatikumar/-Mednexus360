from pydantic import BaseModel


class PatientCreate(BaseModel):

    user_id: int

    age: int

    gender: str

    blood_group: str

    emergency_contact: str


class PatientResponse(BaseModel):

    id: int

    user_id: int

    age: int

    gender: str

    blood_group: str

    emergency_contact: str

    class Config:
        from_attributes = True