from typing import Optional, List

from pydantic import BaseModel


# Create
class CreateBlackboardModel(BaseModel):
    name: str


# Acquire
class TokenModel(BaseModel):
    token: str
    timeout: Optional[int]


# Update
class UpdateBlackboardModal(BaseModel):
    token: str
    name: str
    content: Optional[str]


# Get Blackboard
class BlackboardModel(BaseModel):
    id: str
    name: str
    content: Optional[str]
    timestamp_create: float
    timestamp_edit: float


# Get Status
class BlackboardStatusModel(BaseModel):
    is_empty: bool
    is_edit: bool
    timestamp_edit: float
    timeout: Optional[int]


# The status of the blackboard and all the blackboard information
class BlackboardAndStatusModel(BlackboardModel, BlackboardStatusModel):
    pass


# Get All
class BlackboardListModel(BaseModel):
    blackboard_list: List[BlackboardAndStatusModel]
