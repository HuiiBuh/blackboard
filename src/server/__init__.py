from fastapi import FastAPI

from .endpoints import blackboard_router

app = FastAPI()

app.include_router(blackboard_router)
