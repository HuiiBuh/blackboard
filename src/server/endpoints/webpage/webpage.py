from fastapi import APIRouter
from fastapi.requests import Request
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="server/templates")


# Serve the html for every path except api
@router.get("/{_:path}")
def test(request: Request, _: str = None):
    a = templates.TemplateResponse("index.html", {"request": request})
    return a
