from typing import Optional, List

from pydantic import BaseModel


# Create
class CreateBlackboardModel(BaseModel):
    name: str


# Acquire
class TokenModel(BaseModel):
    token: str


# Update
class UpdateBlackboardModal(BaseModel):
    token: str
    name: str
    content: Optional[str]


# Get Blackboard
class BlackboardModel(BaseModel):
    id: int
    name: str
    content: Optional[str]
    timestamp_create: float
    timestamp_edit: float


# Get Status
class BlackboardStatusModel(BaseModel):
    is_empty: bool
    is_edit: bool
    timestamp_edit: float


# Get All
class BlackboardListModel(BaseModel):
    blackboard_list: List[BlackboardModel]
