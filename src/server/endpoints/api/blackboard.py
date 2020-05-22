from fastapi import APIRouter, HTTPException, status

from .models import *
from src.server.data.blackboard import Blackboard

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

# ==========================================================
# Vorbild für eine REST konforme API https://developer.spotify.com/documentation/web-api/reference/playlists/


@router.post("/blackboards", response_model=CreateBlackboardResponse)
async def create_blackboard(body_data: CreateBlackboardBody):
    """
    Create blackboard with the given name. Names that already exit are invalid.
    :param body_data:
    :return:
    """
    # .....
    try:
        new_blackboard = Blackboard(body_data.name)
        return new_blackboard
    except IndexError as e:
        raise HTTPException(404, 'Blackboard already exists.')


@router.put("/blackboards/{blackboard_name}/acquire", response_model=UpdateBlackboardResponse)
async def acquire_blackboard(blackboard_name: str, body_data: UpdateBlackboardBody):
    """
    Requests a lock for the given blackboard. The blackboard will be acquired if the it hasn't already been acquired by
    someone else. The user is only able to edit the board (change to edit page), if the blackboard could be acquired.

    TODO: Is this the way to go ??
    For identifying the user, he has to have a user_token. This user_token is generated right here and given to the
    user within the response of this call. The user has to use this token when making an update.

    TODO: GOOD / BAD ??
    Additional parameter in body_data - acquire: Can be set to False in order to release the blackboard without making
    an update.
    :param blackboard_name:
    :param body_data:
    :return:
    """
    # Generate user_token

    # Try to acquire blackboard

    # Return whether it was successful or not

    pass


@router.put("/blackboards/{blackboard_name}", response_model=UpdateBlackboardResponse)
async def update_blackboard(blackboard_name: str, body_data: UpdateBlackboardBody):
    """
    Update the content of the blackboard. For this to happen, the user has to lock / acquire the blackboard via
    acquire_update() first. Additionally he must have the user_token transmitted, which was used for acquiring the
    blackboard.
    After the update, the lock of the blackboard will automatically be released.
    :param blackboard_name:
    :param body_data:
    :return:
    """
    # Check if blackboard is acquired with the given user_token

    # If so, update blackboard

    # Release blackboard

    pass


@router.delete("/blackboards/{blackboard_name}", status_code=status.HTTP_200_OK)
async def delete_blackboard(blackboard_name: str):
    """
    Delete the blackboard. For this to happen, the user has to lock / acquire the blackboard via
    acquire_update() first. Additionally he must have the user_token transmitted, which was used for acquiring the
    blackboard.
    :param blackboard_name: Name of the blackboard to be deleted.
    :return:
    """
    if Blackboard.exists(blackboard_name):
        blackboard: Blackboard = Blackboard.get(blackboard_name)
        if blackboard.acquire_edit_mode("master_token"):
            Blackboard.delete(blackboard.get_name())
        else:
            raise HTTPException(status.HTTP_423_LOCKED, 'Blackboard is in use.')
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Blackboard does not exist.')


@router.get("/blackboards/{blackboard_name}/status", response_model=GetBlackboardStatusResponse,
            status_code=status.HTTP_200_OK)
async def get_blackboard_status(blackboard_name: str):
    """
    Return status of blackboard containing
     - is_empty: Has content or not
     - is_edit: A user edits the blackboard right now or not
     - timestamp_edit: Timestamp of the last change
    :param blackboard_name: Name of the blackboard.
    :return:
    """
    if Blackboard.exists(blackboard_name):
        blackboard: Blackboard = Blackboard.get(blackboard_name)
        is_empty, is_edit, timestamp_edit = blackboard.get_state()
        GetBlackboardStatusResponse.is_empty = is_empty
        GetBlackboardStatusResponse.is_edit = is_edit
        GetBlackboardStatusResponse.timestamp_edit = timestamp_edit
        GetBlackboardStatusResponse.name = blackboard_name
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Blackboard does not exist.')


@router.get("/blackboards/{blackboard_name}", response_model=GetBlackboardResponse, status_code=status.HTTP_200_OK)
async def get_blackboard(blackboard_name: str):
    """
    TODO: Do you need a token for getting this information?

    Returns the following information:
     - name: Name of blackboard
     - content: Content of blackboard
     - timestamp_edit: Timestamp of the last change
     - timestamp_create: Timestamp of creation
    :param blackboard_name: Name of the blackboard.
    :return:
    """
    if Blackboard.exists(blackboard_name):
        blackboard: Blackboard = Blackboard.get(blackboard_name)
        GetBlackboardResponse.name = blackboard.get_name()
        GetBlackboardResponse.content = blackboard.get_content()
        GetBlackboardResponse.timestamp_create = blackboard.get_timestamp_create()
        GetBlackboardResponse.timestamp_edit= blackboard.get_timestamp_edit()
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Blackboard does not exist.')


@router.get("/blackboards", response_model=GetAllBlackboardsResponse)
async def get_all_blackboards(body_data: GetAllBlackboardsBody):
    """
    Return a list containing all blackboards with the following information:
    - name
    - timestamp_create
    - timestamp_edit
    - is_empty
    - is_edit
    :param body_data:
    :return:
    """
    pass
