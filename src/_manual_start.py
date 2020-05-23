import uvicorn

from src.server.data.blackboard import Blackboard


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

    # Import string, but with : instead of .
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
