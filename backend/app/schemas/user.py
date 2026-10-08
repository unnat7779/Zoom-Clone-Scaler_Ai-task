from app.schemas.common import ApiModel


class User(ApiModel):
    id: int
    display_name: str
    email: str
    pmi: str
    pmi_formatted: str
    timezone: str
    avatar_color: str
    initials: str
