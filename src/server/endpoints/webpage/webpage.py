import os

from fastapi import APIRouter
from fastapi.requests import Request
from fastapi.responses import HTMLResponse

router = APIRouter()


def get_index_html() -> str:
    file_location = "static/html/index.html"
    html = "<h1>Server error. Could not serve index.html</h1>"
    if os.path.exists(file_location):
        html = open(file_location).read()

    return html


index_html = get_index_html()


# Serve the html for every path except /api and /template
@router.get("/{wildcard:path}", tags=["webpage"], response_class=HTMLResponse)
def serve_webpage(request: Request, wildcard: str = None):
    """
    This serves the webpage to every possible url so we can start the js magic from there\n
    The wildcard parameter is optional is symbolizes every possible path except `/api`, `/static`, `/docs` and `/redoc`
    """
    return HTMLResponse(index_html)
