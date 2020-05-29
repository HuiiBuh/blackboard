import uvicorn

from src.server.data.blackboard import Blackboard
from src.server.data.logger import Logger


def test():
    Blackboard.load_all()

    name = "Klapptes"
    if Blackboard.exists_name(name):
        bb = Blackboard.get_by_name(name)
    else:
        bb = Blackboard("Klapptes")

    # bb.set_name("Esklappt")

    bb.set_content("test")


if __name__ == "__main__":
    # test()

    Logger.info("Server is starting...")

    # Import string, but with : instead of .
    uvicorn.run("server:app", host="0.0.0.0", reload=True)
