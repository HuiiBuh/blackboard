from fastapi import APIRouter
from fastapi.requests import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

# Get the html template directory
templates = Jinja2Templates(directory="static/html")


# Serve the html for every path except /api and /template
@router.get("/{wildcard:path}", tags=["webpage"], response_class=HTMLResponse)
def serve_webpage(request: Request, wildcard: str = None):
    """
    This serves the webpage to every possible url so we can start the js magic from there\n
    The wildcard parameter is optional is symbolizes every possible path except `/api`, `/static`, `/docs` and `/redoc`
    """
    return templates.TemplateResponse("index.html", {"request": request})
