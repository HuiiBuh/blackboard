from pydantic import BaseModel


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


class CreateBlackboardResponse(BaseModel):
    # Successful or not
    # Error message if not
    response_code: int
    response_msg: str


# Acquire Blackboard
class AcquireUpdateBody(BaseModel):
    pass


class AcquireUpdateResponse(BaseModel):
    name: str
    user_token: str
    # Blackboard currently locked by someone else
    is_locked: bool
    # Was the blackboard successfully acquired
    is_acquired: bool
    # Blackboard will be release automatically after timeout
    timeout: int


# Update
class UpdateBlackboardBody(BaseModel):
    user_token: str
    name: str
    content: str


class UpdateBlackboardResponse(BaseModel):
    # Successful or not
    # Error message if not
    response_code: int
    response_msg: str


# Get Blackboard
class GetBlackboardResponse(BaseModel):
    name: str
    content: str
    timestamp_create: float
    timestamp_edit: float
    is_empty: bool
    is_edit: bool


# Get Status
class GetBlackboardStatusResponse(BaseModel):
    name: str
    is_empty: bool
    is_edit: bool
    timestamp_edit: float


# Get all Blackboards
class GetAllBlackboardsBody(BaseModel):
    pass


class GetAllBlackboardsResponse(BaseModel):
    blackboard_list: list = []
