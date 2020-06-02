import uvicorn
from uvicorn.config import LOGGING_CONFIG
from os.path import join

LOGGING_CONFIG["formatters"]["default"]["fmt"] = "[%(asctime)s] - "+LOGGING_CONFIG["formatters"]["default"]["fmt"]
LOGGING_CONFIG["formatters"]["access"]["fmt"] = "[%(asctime)s] - "+LOGGING_CONFIG["formatters"]["access"]["fmt"]

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

if __name__ == "__main__":
    # Import string, but with : instead of '.'
    uvicorn.run("server:app", host="0.0.0.0", reload=True, log_config=LOGGING_CONFIG)
