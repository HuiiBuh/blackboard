import logging
from logging import FileHandler

Logger = logging.getLogger("Blackboard")
Logger.setLevel(logging.DEBUG)

fh = FileHandler("api.log")

Logger.addHandler(fh)