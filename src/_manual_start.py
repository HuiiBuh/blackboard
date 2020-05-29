import uvicorn
from uvicorn.config import LOGGING_CONFIG
from os.path import isfile, join
from src.server.data.blackboard import Blackboard

LOGGING_CONFIG["formatters"]["default"]["fmt"] = "[%(asctime)s]"+LOGGING_CONFIG["formatters"]["default"]["fmt"]
LOGGING_CONFIG["formatters"]["access"]["fmt"] = "[%(asctime)s]"+LOGGING_CONFIG["formatters"]["access"]["fmt"]

LOGGING_CONFIG["handlers"]["file_default"] = {
    "formatter": "default",
    "class": "logging.FileHandler",
    "filename": join(join(".", "log"), "api_console.log")
}

LOGGING_CONFIG["handlers"]["file_access"] = {
    "formatter": "access",
    "class": "logging.FileHandler",
    "filename": join(join(".", "log"), "api_access.log")
}

LOGGING_CONFIG["loggers"][""]["handlers"].append("file_default")
LOGGING_CONFIG["loggers"]["uvicorn.access"]["handlers"].append("file_access")


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
    uvicorn.run("server:app", host="0.0.0.0", reload=True, log_config=LOGGING_CONFIG)
