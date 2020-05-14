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
