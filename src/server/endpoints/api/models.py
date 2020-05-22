from pydantic import BaseModel
from typing import Union, Optional


# Response models have to extend BaseModel.
# The purpose of the base model class is to deserialize the json, check the types of the json and look for missing
# parameters
class HelloResponseRepresentation(BaseModel):
    hello: str


# Body parameters have to extend BaseModel as well.
# If the body params do not match the base model the user will get an information which what he has done wrong
class BodyExample(BaseModel):
    name: str
    greeting: HelloResponseRepresentation

    """
    {
        "name": "some string", 
        "greeting: {
            "hello": "some string"
        }
    }
    """


# Create
class CreateBlackboardBody(BaseModel):
    name: str


class AcquireUpdateResponse(BaseModel):
    token: str


class ReleaseUpdateBody(BaseModel):
    token: str


# Update
class UpdateBlackboardBody(BaseModel):
    token: str
    name: Union[None, str]
    content: Union[None, str]


class UpdateBlackboardResponse(BaseModel):
    # Successful or not
    # Error message if not
    response_code: int
    response_msg: str


# Get Blackboard
class GetBlackboardResponse(BaseModel):
    name: str
    content: Optional[str]
    timestamp_create: float
    timestamp_edit: float


# Get Status
class GetBlackboardStatusResponse(BaseModel):
    name: str
    is_empty: bool
    is_edit: bool
    timestamp_edit: float


class GetAllBlackboardsResponse(BaseModel):
    blackboard_list: list = []
