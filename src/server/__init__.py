from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .endpoints.api.blackboard import router as blackboard_router
from .endpoints.webpage.webpage import router as webpage_router

# Create an instance of the web framework
app = FastAPI()

# Serve the static files from the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include the router which will handle the requests
app.include_router(blackboard_router, prefix='/api', tags=["api"])
app.include_router(webpage_router, prefix="")
