from pydantic import BaseModel
from typing import Union, Optional


# Create
class CreateBlackboardBody(BaseModel):
    name: str


# Acquire
class AcquireUpdateResponse(BaseModel):
    token: str


# Release
class ReleaseUpdateBody(BaseModel):
    token: str


# Update
class UpdateBlackboardBody(BaseModel):
    token: str
    name: Union[None, str]
    content: Union[None, str]


# Get Blackboard
class GetBlackboardResponse(BaseModel):
    id: int
    name: str
    content: Optional[str]
    timestamp_create: float
    timestamp_edit: float


# Get Status
class GetBlackboardStatusResponse(BaseModel):
    is_empty: bool
    is_edit: bool
    timestamp_edit: float


# Get All
class GetAllBlackboardsResponse(BaseModel):
    blackboard_list: list = []
