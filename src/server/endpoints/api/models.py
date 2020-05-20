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


class CreateBlackboardBody(BaseModel):
    name: str


class CreateBlackboardResponse(BaseModel):
    response_code: int
    response_msg: str


class UpdateBlackboardBody(BaseModel):
    token: str
    name: str
    content: str


class UpdateBlackboardResponse(BaseModel):
    # Successful or not
    response_code: int
    response_msg: str


class AcquireUpdateBody(BaseModel):
    token: str
    name: str


class AcquireUpdateResponse(BaseModel):
    name: str
    # Blackboard currently locked by someone else
    is_locked: bool
    # Was the blackboard successfully acquired
    is_acquired: bool
    # Blackboard will be release automatically after timeout
    timeout: int


class DeleteBlackboardBody(BaseModel):
    token: str
    name: str


class DeleteBlackboardResponse(BaseModel):
    response_code: int
    response_msg: str


class GetBlackboardContentBody(BaseModel):
    name: str


class GetBlackboardContentResponse(BaseModel):
    name: str
    content: str
    timestamp_create: float
    timestamp_edit: float


class GetBlackboardStatusBody(BaseModel):
    name: str


class GetBlackboardStatusResponse(BaseModel):
    name: str
    is_empty: bool
    is_edit: bool
    timestamp_edit: float


class GetBlackboardListBody(BaseModel):
    pass


class GetBlackboardListResponse(BaseModel):
    blackboard_list: []
