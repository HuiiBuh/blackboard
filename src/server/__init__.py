from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware import Middleware

from .endpoints.blackboard import router as blackboard_router

# Add the cors middleware so you can make CORS request in js
middleware: List[Middleware] = [
    Middleware(CORSMiddleware, allowed_hosts=['*'])
]

# Create an instance of the web framework
app = FastAPI(middleware=middleware)

# Include the router which will handle the requests
app.include_router(blackboard_router)
