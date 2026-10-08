"""Random identifiers (PRD §10.2). All randomness comes from ``secrets``."""

import hashlib
import secrets
import uuid
from collections.abc import Callable

PASSCODE_ALPHABET = "".join(
    ch
    for ch in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    if ch not in "0OoIl1"
)
MAX_ATTEMPTS = 5


def _digits(first_digits: str, length: int) -> str:
    rest = "".join(secrets.choice("0123456789") for _ in range(length - 1))
    return secrets.choice(first_digits) + rest


def meeting_number() -> str:
    """11 digits starting with 8 or 9, e.g. ``81234567890``."""
    return _digits("89", 11)


def pmi() -> str:
    """10 digits starting with 2-9, e.g. ``5123456789``."""
    return _digits("23456789", 10)


def passcode() -> str:
    """6 mixed-case alphanumerics without the ambiguous ``0OoIl1``."""
    return "".join(secrets.choice(PASSCODE_ALPHABET) for _ in range(6))


def invite_token() -> str:
    """The ``?pwd=`` value of invite links: 32 URL-safe characters."""
    return secrets.token_urlsafe(24)


def instance_uuid() -> str:
    return uuid.uuid4().hex


def numeric_passcode(passcode_value: str) -> str:
    """6-digit phone passcode derived from the passcode (info popover only, never stored)."""
    digest = hashlib.sha256(passcode_value.encode()).hexdigest()
    return f"{int(digest, 16) % 10**6:06d}"


def unique(generate: Callable[[], str], is_taken: Callable[[str], bool]) -> str:
    """Draw from ``generate`` until ``is_taken`` is false (at most ``MAX_ATTEMPTS`` tries)."""
    for _ in range(MAX_ATTEMPTS):
        candidate = generate()
        if not is_taken(candidate):
            return candidate
    raise RuntimeError(f"Could not generate a unique value after {MAX_ATTEMPTS} attempts")
