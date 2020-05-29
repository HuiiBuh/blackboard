import uvicorn
from uvicorn.config import LOGGING_CONFIG

LOGGING_CONFIG["handlers"]["file_default"] = {
    "formatter": "default",
    "class": "logging.FileHandler",
    "filename": "api.log"
}

LOGGING_CONFIG["handlers"]["file_access"] = {
    "formatter": "access",
    "class": "logging.FileHandler",
    "filename": "api_access.log"
}

LOGGING_CONFIG["loggers"][""]["handlers"].append("file_default")
LOGGING_CONFIG["loggers"]["uvicorn.access"]["handlers"].append("file_access")

if __name__ == "__main__":
    # Import string, but with : instead of '.'
    uvicorn.run("server:app", host="0.0.0.0", reload=True, log_config=LOGGING_CONFIG)
