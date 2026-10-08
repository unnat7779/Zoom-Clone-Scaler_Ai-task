"""Catalogue of the domain errors returned by the API (PRD §10.4)."""

from http import HTTPStatus

from app.core.errors import AppError


def meeting_not_found() -> AppError:
    return AppError(HTTPStatus.NOT_FOUND, "MEETING_NOT_FOUND", "This meeting does not exist.")


def instance_not_found() -> AppError:
    return AppError(
        HTTPStatus.NOT_FOUND, "INSTANCE_NOT_FOUND", "This meeting session does not exist."
    )


def user_not_found() -> AppError:
    return AppError(HTTPStatus.NOT_FOUND, "USER_NOT_FOUND", "The default user has not been seeded.")


def meeting_live() -> AppError:
    return AppError(HTTPStatus.CONFLICT, "MEETING_LIVE", "This meeting is in progress.")


def pmi_not_deletable() -> AppError:
    return AppError(
        HTTPStatus.BAD_REQUEST, "PMI_NOT_DELETABLE", "Your Personal Meeting ID cannot be deleted."
    )


def not_scheduled() -> AppError:
    return AppError(
        HTTPStatus.BAD_REQUEST, "NOT_SCHEDULED", "Only scheduled meetings can be edited here."
    )


def wrong_passcode() -> AppError:
    return AppError(HTTPStatus.FORBIDDEN, "WRONG_PASSCODE", "Incorrect meeting passcode")


def meeting_not_started() -> AppError:
    return AppError(
        HTTPStatus.CONFLICT,
        "MEETING_NOT_STARTED",
        "Waiting for the host to start this meeting.",
    )


def meeting_full() -> AppError:
    return AppError(HTTPStatus.CONFLICT, "MEETING_FULL", "This meeting is full.")


def removed() -> AppError:
    return AppError(HTTPStatus.FORBIDDEN, "REMOVED", "You have been removed from this meeting.")


def unauthorized() -> AppError:
    return AppError(HTTPStatus.UNAUTHORIZED, "UNAUTHORIZED", "Invalid or expired meeting token.")


def not_host() -> AppError:
    return AppError(HTTPStatus.FORBIDDEN, "NOT_HOST", "Only the host can do that.")


def unmute_not_allowed() -> AppError:
    return AppError(
        HTTPStatus.FORBIDDEN,
        "NOT_HOST",
        "The host has not allowed participants to unmute themselves.",
    )


def bad_message(message: str) -> AppError:
    return AppError(HTTPStatus.BAD_REQUEST, "BAD_MESSAGE", message)


def start_in_past() -> AppError:
    """422 with its own code: the Schedule form shows it under "When" without matching copy."""
    return AppError(
        HTTPStatus.UNPROCESSABLE_ENTITY, "START_IN_PAST", "The start time has already passed"
    )


def validation(message: str) -> AppError:
    return AppError(HTTPStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", message)
