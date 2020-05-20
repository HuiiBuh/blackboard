from fastapi import APIRouter
from .models import *

router = APIRouter()


@router.get("/", response_model=HelloResponseRepresentation)
async def home(name: str = "world"):
    """
    MARKDOWN and basic HTML is supported!

    A route which can be used to say hello to you\n
    \n
    __:param__ `name` The name which should be greeted (optional)\n
    __:return__ A json which greets you\n

    ```json
    {
        hello:your_name
    }
    ```
    """

    return {
        'hello': name
    }


@router.post("/body", response_model=HelloResponseRepresentation)
async def body_example(the_body_data: BodyExample):
    """
    This route uses the body of a request to get the data.\n
    In general FastAPI tries to get the data and type you put into the function. \n
    It does not make a difference between url params and body params. \n
    If you pass multiple body parameters the variable names of the function will be used as a key.\n
    \n
    In @router.httpmethod( <- Here you can put in a lot of different information which will be shown in the api doc)

    __:param__ `the_body_data`: The data you transmit in the body of a http request \n
    __:return:__ The same thing as in home view
    """
    return {
        "hello": the_body_data.name
    }


@router.post("/create_blackboard", response_model=CreateBlackboardResponse)
async def create_blackboard(body_data: CreateBlackboardBody):
    pass


@router.post("/acquire_update", response_model=UpdateBlackboardResponse)
async def acquire_update(body_data: UpdateBlackboardBody):
    pass


@router.post("/update_blackboard", response_model=UpdateBlackboardResponse)
async def update_blackboard(body_data: UpdateBlackboardBody):
    pass


@router.post("/delete_blackboard", response_model=DeleteBlackboardResponse)
async def delete_blackboard(body_data: DeleteBlackboardBody):
    pass


@router.get("/read_blackboard", response_model=GetBlackboardContentResponse)
async def get_blackboard_content(body_data: GetBlackboardContentBody):
    pass


@router.get("/get_blackboard_status", response_model=GetBlackboardStatusResponse)
async def get_blackboard_status(body_data: GetBlackboardStatusBody):
    pass


@router.get("/get_all_blackboard", response_model=GetBlackboardListResponse)
async def get_all_blackboards(body_data: GetBlackboardListBody):
    pass
