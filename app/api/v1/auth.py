from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.core.logger import logger
from app.core.rbac import require_role
from sqlalchemy.orm import Session
from app.dependencies import get_current_user

from app.dependencies import get_db
from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserLogin
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        email=user.email,
        hashed_password=hash_password(
            user.password
        ),
        role=user.role.upper()
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)
    
    logger.info(
    f"New user registered: {new_user.email}"
)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:

     logger.warning(
        f"Login failed: {user.email}"
    )

     raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

    if not verify_password(
    user.password,
    existing_user.hashed_password
):

     logger.warning(
        f"Wrong password attempt: {user.email}"
    )

     raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

    access_token = create_access_token(
        {
            "sub": existing_user.email,
            "user_id": existing_user.id,
            "role": existing_user.role
        }
    )
    logger.info(
    f"User logged in: {existing_user.email}"
)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    
    
@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }    
    
@router.get("/patient-dashboard")
def patient_dashboard(
    current_user=Depends(
        require_role(["PATIENT"])
    )
):
    return {
        "message": "Welcome Patient"
    }
    
    
@router.get("/doctor-dashboard")
def doctor_dashboard(
    current_user=Depends(
        require_role(["DOCTOR"])
    )
):
    return {
        "message": "Welcome Doctor"
    }


@router.get("/hospital-admin")
def hospital_admin_dashboard(
    current_user=Depends(
        require_role(["HOSPITAL_ADMIN"])
    )
):
    return {
        "message": "Welcome Hospital Admin"
    }            