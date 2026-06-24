from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.notification import Notification

from app.schemas.notification import (
    NotificationResponse
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# GET ALL NOTIFICATIONS OF A USER
@router.get(
    "/user/{user_id}",
    response_model=list[NotificationResponse]
)
def get_notifications(
    user_id: int,
    db: Session = Depends(get_db)
):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id == user_id
    ).all()

    return notifications


# MARK NOTIFICATION AS READ
@router.put(
    "/{notification_id}/read"
)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db)
):

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    return {
        "message": "Notification marked as read"
    }


# GET UNREAD NOTIFICATIONS
@router.get(
    "/user/{user_id}/unread",
    response_model=list[NotificationResponse]
)
def get_unread_notifications(
    user_id: int,
    db: Session = Depends(get_db)
):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).all()

    return notifications


# DELETE NOTIFICATION
@router.delete(
    "/{notification_id}"
)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    db.delete(notification)

    db.commit()

    return {
        "message": "Notification deleted successfully"
    }


# MARK ALL USER NOTIFICATIONS AS READ
@router.put(
    "/user/{user_id}/read-all"
)
def mark_all_as_read(
    user_id: int,
    db: Session = Depends(get_db)
):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).all()

    for notification in notifications:
        notification.is_read = True

    db.commit()

    return {
        "message": "All notifications marked as read"
    }