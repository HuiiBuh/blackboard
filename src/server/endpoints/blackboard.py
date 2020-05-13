from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def new_game():
    return {
        'hello': 'world'
    }
