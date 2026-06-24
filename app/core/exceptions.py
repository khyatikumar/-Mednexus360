from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.custom_exceptions import (
    NotFoundException,
    UnauthorizedException,
    ForbiddenException
)


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "errors": exc.errors()
        }
    )


async def not_found_handler(
    request: Request,
    exc: NotFoundException
):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": exc.message
        }
    )


async def unauthorized_handler(
    request: Request,
    exc: UnauthorizedException
):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": exc.message
        }
    )


async def forbidden_handler(
    request: Request,
    exc: ForbiddenException
):
    return JSONResponse(
        status_code=403,
        content={
            "success": False,
            "message": exc.message
        }
    )