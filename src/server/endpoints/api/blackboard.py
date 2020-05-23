from typing import List
from uuid import uuid1

from fastapi import APIRouter, HTTPException, status

from server.data.blackboard import Blackboard
from .models import *

router = APIRouter()


# ==========================================================
# Vorbild für eine REST konforme API https://developer.spotify.com/documentation/web-api/reference/playlists/

@router.get("/blackboards", response_model=GetAllBlackboardsResponse)
async def get_all_blackboards():
    """
    Return a list containing all blackboards with the following information:
    - name
    - timestamp_create
    - timestamp_edit
    - is_empty
    - is_edit
    :return:
    """
    blackboards: List[Blackboard] = Blackboard.get_all()

    return {
        "blackboard_list": [b.get_overview() for b in blackboards]
    }


@router.post("/blackboards", status_code=status.HTTP_201_CREATED)
async def create_blackboard(body_data: CreateBlackboardBody):
    """
    Create blackboard with the given name. Names that already exit are invalid.
    :param body_data:
    :return:
    """
    try:
        Blackboard(body_data.name)
    except ValueError as e:
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))
    except IndexError as e:
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))


@router.get("/blackboards/{blackboard_name}/acquire", status_code=status.HTTP_202_ACCEPTED,
            response_model=UpdateBlackboardResponse)
async def acquire_blackboard(blackboard_name: str):
    """
    Requests a lock for the given blackboard. The blackboard will be acquired if the it hasn't already been acquired by
    someone else. The user is only able to edit the board (change to edit page), if the blackboard could be acquired.
    :param blackboard_name:
    :return:
    """

    if not Blackboard.exists(blackboard_name):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Could not find blackboard with name {blackboard_name}!")

    blackboard: Blackboard = Blackboard.get(blackboard_name)

    # Generate user_token
    token = uuid1().hex
    # Try to acquire blackboard
    if not blackboard.acquire_edit_mode(token):
        # todo return timeout time
        raise HTTPException(status.HTTP_423_LOCKED, "Could not acquire edit mode. Already in use!")

    # todo return timeout
    return {
        "token": token
    }


@router.put("/blackboards/{blackboard_name}/release", status_code=status.HTTP_202_ACCEPTED)
async def release_blackboard(blackboard_name: str, body_data: ReleaseUpdateBody):
    """
    Releases the lock for the given blackboard.
    :param blackboard_name:
    :param body_data: Name of the blackboard.
    :return:
    """
    if not Blackboard.exists(blackboard_name):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Could not find blackboard with name {blackboard_name}!")

    blackboard: Blackboard = Blackboard.get(blackboard_name)

    if not blackboard.get_edited_by() == body_data.token:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your are not allowed to release the edit mode!")

    if not blackboard.release_edit_mode():
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Could not release edit mode!")


@router.put("/blackboards/{blackboard_name}/update", response_model=UpdateBlackboardResponse)
async def update_blackboard(blackboard_name: str, body_data: UpdateBlackboardBody):
    """
    Update the content of the blackboard. For this to happen, the user has to lock / acquire the blackboard via
    acquire_update() first. Additionally he must have the user_token transmitted, which was used for acquiring the
    blackboard.
    After the update, the lock of the blackboard will automatically be released.
    :param blackboard_name: Name of the blackboard.
    :param body_data:
    :return:
    """
    if not Blackboard.exists(blackboard_name):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Could not find blackboard with name {blackboard_name}!")

    blackboard: Blackboard = Blackboard.get(blackboard_name)

    if not blackboard.get_edited_by() == body_data.token:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your are not allowed to edit the blackboard!")

    if body_data.name is not None:
        try:
            blackboard.set_name(body_data.name)
        except ValueError as e:
            raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))
        except IndexError as e:
            raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))

    try:
        blackboard.set_content(body_data.content)
    except ValueError as e:
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, str(e))


@router.delete("/blackboards/{blackboard_name}")
async def delete_blackboard(blackboard_name: str):
    """
    Delete the blackboard. For this to happen, the user has to lock / acquire the blackboard via
    acquire_update() first. Additionally he must have the user_token transmitted, which was used for acquiring the
    blackboard.
    :param blackboard_name: Name of the blackboard to be deleted.
    :return:
    """
    if not Blackboard.exists(blackboard_name):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Could not find blackboard with name {blackboard_name}!")

    blackboard: Blackboard = Blackboard.get(blackboard_name)
    if not blackboard.acquire_edit_mode("master_token"):
        # TODO return timeout time
        raise HTTPException(status.HTTP_423_LOCKED, "Could not acquire edit mode. Already in use!")

    Blackboard.delete(blackboard.get_name())


@router.get("/blackboards/{blackboard_name}/status", response_model=GetBlackboardStatusResponse)
async def get_blackboard_status(blackboard_name: str):
    """
    Return status of blackboard containing
     - is_empty: Has content or not
     - is_edit: A user edits the blackboard right now or not
     - timestamp_edit: Timestamp of the last change
    :param blackboard_name: Name of the blackboard.
    :return:
    """
    if not Blackboard.exists(blackboard_name):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Could not find blackboard with name {blackboard_name}!")

    blackboard: Blackboard = Blackboard.get(blackboard_name)
    is_empty, is_edit, timestamp_edit = blackboard.get_state()

    return {
        "name": blackboard.get_name(),
        "is_empty": is_empty,
        "is_edit": is_edit,
        "timestamp_edit": timestamp_edit
    }


@router.get("/blackboards/{blackboard_name}", response_model=GetBlackboardResponse)
async def get_blackboard(blackboard_name: str):
    """
    Returns the following information:
     - name: Name of blackboard
     - content: Content of blackboard
     - timestamp_edit: Timestamp of the last change
     - timestamp_create: Timestamp of creation
    :param blackboard_name: Name of the blackboard.
    :return:
    """
    if not Blackboard.exists(blackboard_name):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Could not find blackboard with name {blackboard_name}!")

    blackboard: Blackboard = Blackboard.get(blackboard_name)

    return blackboard.to_dict()
