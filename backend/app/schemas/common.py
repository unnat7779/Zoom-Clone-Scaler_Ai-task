from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints


class ApiModel(BaseModel):
    """Base for response models."""

    model_config = ConfigDict(from_attributes=True)


class RequestModel(BaseModel):
    """Base for request bodies: unknown fields are rejected."""

    model_config = ConfigDict(extra="forbid")


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    """Shape of every non-2xx response."""

    error: ErrorDetail


def error_responses(*status_codes: int) -> dict[int | str, dict[str, object]]:
    """OpenAPI ``responses=`` entry documenting the error envelope for the given statuses."""
    return {status: {"model": ErrorResponse} for status in status_codes}


ClientId = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=64)]
DisplayName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=64)]
