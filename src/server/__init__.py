from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .endpoints.api.blackboard import router as blackboard_router
from .endpoints.webpage.webpage import router as webpage_router

# Create an instance of the web framework
app = FastAPI()

# Add the cors middleware so you can make CORS request in js
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])

# Add the static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include the router which will handle the requests
app.include_router(blackboard_router, prefix='/api')
app.include_router(webpage_router, prefix="")

