from fastapi import APIRouter

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"]
)


@router.post("/send")
def send_reminders():

    return {
        "message":
        "Reminder service executed"
    }