import logging
from logging import FileHandler, Formatter, StreamHandler

Logger = logging.getLogger("Blackboard")
Logger.setLevel(logging.DEBUG)

fh = FileHandler("api.log")
sh = StreamHandler()

formatter = Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

sh.setFormatter(formatter)
fh.setFormatter(formatter)

Logger.addHandler(sh)
Logger.addHandler(fh)