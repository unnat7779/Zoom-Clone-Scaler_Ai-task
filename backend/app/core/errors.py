"""One error type plus handlers rendering every failure as ``{"error": {"code", "message"}}``."""

import logging
from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class AppError(Exception):
    """A business error with a stable machine-readable code (PRD §10.4)."""

    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


def error_body(code: str, message: str) -> dict[str, dict[str, str]]:
    return {"error": {"code": code, "message": message}}


CUSTOM_MESSAGE_PREFIX = "Value error, "


def _validation_message(exc: RequestValidationError) -> str:
    """First error as text: our own validator messages verbatim, others prefixed by the field."""
    first = exc.errors()[0]
    message = str(first.get("msg", "Invalid request"))
    if message.startswith(CUSTOM_MESSAGE_PREFIX):
        return message.removeprefix(CUSTOM_MESSAGE_PREFIX)
    field = ".".join(str(part) for part in first.get("loc", ()) if part not in ("body", "query"))
    return f"{field}: {message}" if field else message


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _app_error(_request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(error_body(exc.code, exc.message), status_code=exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def _validation_error(_request: Request, exc: RequestValidationError) -> JSONResponse:
        body = error_body("VALIDATION_ERROR", _validation_message(exc))
        return JSONResponse(body, status_code=HTTPStatus.UNPROCESSABLE_ENTITY)

    @app.exception_handler(StarletteHTTPException)
    async def _http_error(_request: Request, exc: StarletteHTTPException) -> JSONResponse:
        code = HTTPStatus(exc.status_code).name
        return JSONResponse(error_body(code, str(exc.detail)), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def _unexpected_error(_request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled error", exc_info=exc)
        body = error_body("INTERNAL_ERROR", "Something went wrong")
        return JSONResponse(body, status_code=HTTPStatus.INTERNAL_SERVER_ERROR)
