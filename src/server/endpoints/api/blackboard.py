from logging import getLogger
from uuid import uuid1

from fastapi import APIRouter, HTTPException, status

from .models import *
from ...data.blackboard import Blackboard

router = APIRouter()

Logger = getLogger("uvicorn")


@router.get("/blackboards", response_model=BlackboardListModel)
async def get_all_blackboards():
    """
    Return a list containing all blackboards with the following information:
    - `name`: Name of blackboard
    - `timestamp_create`: Timestamp of creation
    - `timestamp_edit`: Timestamp of the last change
    - `is_empty`: True if content is null else False
    - `is_edit`: True if someone edits the blackboard else False
    """
    blackboards: List[Blackboard] = Blackboard.get_all()
    return {
        "blackboard_list": [b.get_overview() for b in blackboards]
    }


@router.post("/blackboards", status_code=status.HTTP_201_CREATED)
async def create_blackboard(body_data: CreateBlackboardModel):
    """
    Create blackboard with the given name. Names that already exit are invalid.

    Body parameter:
     - `name`: Name of blackboard.
    """
    try:
        Blackboard(body_data.name)
    except ValueError as e:
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))
    except IndexError as e:
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))


@router.get("/blackboards/{blackboard_id}", response_model=BlackboardModel)
async def get_blackboard(blackboard_id: str):
    """
    Query parameter:
     - `blackboard_id`: ID of blackboard.

    Returns the following information:
     - `id`: ID of blackboard
     - `name`: Name of blackboard
     - `content`: Content of blackboard
     - `timestamp_edit`: Timestamp of the last change
     - `timestamp_create`: Timestamp of creation
    """
    if not Blackboard.exists(blackboard_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Could not find blackboard!")

    blackboard: Blackboard = Blackboard.get(blackboard_id)

    return blackboard.to_dict()


@router.delete("/blackboards/{blackboard_id}")
async def delete_blackboard(blackboard_id: str):
    """
    Delete the blackboard. For this to happen, the user has to lock / acquire the blackboard via
    acquire_update() first. Additionally he must have the user_token transmitted, which was used for acquiring the
    blackboard.

    Query parameter:
     - `blackboard_id`: ID of blackboard.
    """
    if not Blackboard.exists(blackboard_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Could not find blackboard!")

    blackboard: Blackboard = Blackboard.get(blackboard_id)
    if not blackboard.acquire_edit_mode("master_token"):
        # TODO return timeout time
        raise HTTPException(status.HTTP_423_LOCKED, "Could not delete blackboard. Currently in use!")

    Blackboard.delete(blackboard_id)


@router.get("/blackboards/{blackboard_id}/status", response_model=BlackboardStatusModel)
async def get_blackboard_status(blackboard_id: str):
    """
    Get the status of the blackboard containing several information.

    Query param
     - `blackboard_id`: ID of blackboard.

    Return status of blackboard containing
     - `is_empty`: Has content or not
     - `is_edit`: A user edits the blackboard right now or not
     - `timestamp_edit`: Timestamp of the last change
    """
    if not Blackboard.exists(blackboard_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Could not find blackboard!")

    blackboard: Blackboard = Blackboard.get(blackboard_id)

    blackboard_state = blackboard.get_state()

    return blackboard_state


@router.get("/blackboards/{blackboard_id}/acquire", status_code=status.HTTP_202_ACCEPTED,
            response_model=TokenModel)
async def acquire_blackboard(blackboard_id: str, token: str = None):
    """
    Requests a lock for the given blackboard. The blackboard will be acquired if the it hasn't already been acquired by
    someone else. The user is only able to edit the board (change to edit page), if the blackboard could be acquired.

    Query parameter:
    - `blackboard_id`: ID of blackboard.
    - `token`: Optional the editing token to reset the timeout

    Return status of lock containing
    - `token`: Edit token, which is required for all further operations
    - `timeout`: Time in seconds until the blackboard times out and is released again
    """

    if not Blackboard.exists(blackboard_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Could not find blackboard!")

    blackboard: Blackboard = Blackboard.get(blackboard_id)

    # Generate user_token
    token = token or uuid1().hex
    # Try to acquire blackboard
    if not blackboard.acquire_edit_mode(token):
        raise HTTPException(status.HTTP_423_LOCKED, "Could not acquire edit mode. Already in use!")

    return {
        "token": token,
        "timeout": blackboard.get_timeout_in_sec()
    }


@router.put("/blackboards/{blackboard_id}/update")
async def update_blackboard(blackboard_id: str, body_data: UpdateBlackboardModal):
    """
    Update the content of the blackboard. For this to happen, the user has to lock / acquire the blackboard via
    acquire_update() first. Additionally he must have the user_token transmitted, which was used for acquiring the
    blackboard.
    After the update, the lock of the blackboard will automatically be released.

    Query parameter:
    - `blackboard_id`: ID of blackboard.

    Body parameter:
    - `token`: Edit token which is required to edit the blackboard
    - `name`: (new or old) Name of blackboard.
    - `content`:  (new or old) Content of blackboard.

    """
    if not Blackboard.exists(blackboard_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Could not find blackboard!")

    blackboard: Blackboard = Blackboard.get(blackboard_id)

    if not blackboard.get_edited_by() == body_data.token:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your are not allowed to edit the blackboard!")

    # Update name
    if blackboard.get_name() != body_data.name:
        try:
            blackboard.set_name(body_data.name)
        except ValueError as e:
            raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))
        except IndexError as e:
            raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))

    # Update content
    try:
        blackboard.set_content(body_data.content)
    except ValueError as e:
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))


@router.put("/blackboards/{blackboard_id}/release", status_code=status.HTTP_202_ACCEPTED)
async def release_blackboard(blackboard_id: str, body_data: TokenModel):
    """
    Releases the lock for the given blackboard.

    Query parameter:
    - `blackboard_id`: ID of blackboard.

    Body parameter:
    - `token`: Edit token which is required to release edit mode of the blackboard.
    """
    if not Blackboard.exists(blackboard_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Could not find blackboard!")

    blackboard: Blackboard = Blackboard.get(blackboard_id)

    if not blackboard.get_edited_by() == body_data.token:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your are not allowed to release the edit mode!")

    if not blackboard.release_edit_mode():
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Could not release edit mode!")


@router.get("/search", response_model=BlackboardListModel)
async def search(q: str):
    """
    Search for a specific blackboard name or the content of a blackboard

    URL query:
     - `q`: The search query
    """

    search_result = Blackboard.search(q)
    return {
        "blackboard_list": [b.get_overview() for b in search_result]
    }
