from fastapi import APIRouter

from app.core.db import DbSession
from app.routers.dependencies import AppSettings
from app.schemas.common import error_responses
from app.schemas.instance import InstanceDetail
from app.services import meeting_queries

router = APIRouter(prefix="/api/instances", tags=["instances"])


@router.get(
    "/{uuid}",
    response_model=InstanceDetail,
    responses=error_responses(404),
    summary="An ended meeting with its participants (Meetings → Previous detail)",
)
def get_instance(uuid: str, db: DbSession, settings: AppSettings) -> InstanceDetail:
    return meeting_queries.instance_detail(db, uuid, settings.app_url)
