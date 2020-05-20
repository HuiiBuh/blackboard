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


# Vorbild für eine REST konforme API https://developer.spotify.com/documentation/web-api/reference/playlists/

@router.post("/blackboards", response_model=CreateBlackboardResponse)
async def create_blackboard(body_data: CreateBlackboardBody):
    pass


@router.post("/acquire_update", response_model=UpdateBlackboardResponse)
async def acquire_update(body_data: UpdateBlackboardBody):
    pass
    # TODO das schaut für mich wie update_blackboard aus, oder soll das den lock requesten?


@router.put("/blackboards/{blackboard_id}", response_model=UpdateBlackboardResponse)
async def update_blackboard(blackboard_id: str, body_data: UpdateBlackboardBody):
    pass


@router.delete("/blackboards/{blackboard_id}", response_model=DeleteBlackboardResponse)
async def delete_blackboard(blackboard_id: str, body_data: DeleteBlackboardBody):
    pass


@router.get("/blackboards/{blackboard_id}", response_model=GetBlackboardContentResponse)
async def get_blackboard_content(blackboard_id: str, body_data: GetBlackboardContentBody):
    pass


@router.get("/get_blackboard_status", response_model=GetBlackboardStatusResponse)
async def get_blackboard_status(body_data: GetBlackboardStatusBody):
    pass
    # TODO das schaut für mich wie get_blackboard_content, bzw sollte damit auch erschlagen werden


@router.get("/blackboards", response_model=GetBlackboardListResponse)
async def get_all_blackboards(body_data: GetBlackboardListBody):
    pass
