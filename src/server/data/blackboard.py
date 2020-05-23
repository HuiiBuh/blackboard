import json
import re
from os import listdir, remove
from os.path import isfile, join
from threading import Lock
from typing import Union, Tuple, List

import time


class Blackboard:
    _BLACKBOARDS = {}

    PATH = join(join(".", "server"), "db")

    _NAME_PATTERN = re.compile("[^a-zA-Z]")
    _MIN_NAME_LENGTH = 3
    _MAX_NAME_LENGTH = 32

    _MIN_CONTENT_LENGTH = 1
    _MAX_CONTENT_LENGTH = 1024

    def __init__(self, name: str, content: Union[None, str] = None, timestamp_create: float = time.time(),
                 timestamp_edit: float = time.time(), blackboard_id: int = 0):
        if Blackboard.exists_name(name):
            raise IndexError(f"Blackboard with name '{name}' already exists!")

        if Blackboard._NAME_PATTERN.findall(name):
            raise ValueError("Name should only consist of a-z and A-Z letters.")

        if not Blackboard._MIN_NAME_LENGTH < len(name) < Blackboard._MAX_NAME_LENGTH:
            raise ValueError(f"Name should have a length of:"
                             f" {Blackboard._MIN_NAME_LENGTH} < length < {Blackboard._MAX_NAME_LENGTH}")

        # Set ID
        self._id = blackboard_id
        if self._id == 0:
            # No ID given. This means that to blackboard wasn't loaded but created.
            # IMPORTANT: Blackboard IDs start at 1. Otherwise there would be problems when loading the blackboard
            # with the ID 0.
            self._id = 1
            for blackboard in Blackboard._BLACKBOARDS.values():
                if blackboard.get_id() >= self._id:
                    self._id = blackboard.get_id() + 1

        self._name: str = name
        self._content: Union[None, str] = content
        self._timestamp_create: float = timestamp_create
        self._timestamp_edit: float = timestamp_edit
        self._edited_by: Union[None, str] = None

        self._lock = Lock()

        self.save()

        Blackboard._BLACKBOARDS[self._id] = self

    def get_id(self) -> int:
        return self._id

    def set_name(self, name: str) -> None:
        if Blackboard._NAME_PATTERN.findall(name):
            raise ValueError("Name should only consist of a-z and A-Z letters.")

        if not Blackboard._MIN_NAME_LENGTH < len(name) < Blackboard._MAX_NAME_LENGTH:
            raise ValueError(f"Name should have a length of:"
                             f" {Blackboard._MIN_NAME_LENGTH} < length < {Blackboard._MAX_NAME_LENGTH}")

        if Blackboard.exists_name(name):
            raise IndexError(f"Blackboard with name '{name}' already exists!")

        Blackboard.delete_file(self.get_id())

        self._name = name
        self._timestamp_edit = time.time()

        self.save()

    def get_name(self) -> str:
        return self._name

    def set_content(self, content: Union[None, str]) -> None:

        if isinstance(content, str) and not content:
            content = None

        if content is not None and not Blackboard._MIN_CONTENT_LENGTH < len(content) < Blackboard._MAX_CONTENT_LENGTH:
            raise ValueError(f"Content size should be: "
                             f"{Blackboard._MIN_CONTENT_LENGTH} < length < {Blackboard._MAX_CONTENT_LENGTH}")

        self._content = content
        self._timestamp_edit = time.time()

        self.save()

    def get_content(self) -> Union[None, str]:
        return self._content

    def get_timestamp_create(self) -> float:
        return self._timestamp_create

    def get_timestamp_edit(self) -> float:
        return self._timestamp_create

    def get_state(self) -> dict:
        return {
            "is_empty": self.get_content() is None,
            "is_edit": self.get_edited_by() is not None,
            "timestamp_edit": self.get_timestamp_edit()
        }

    def get_edited_by(self) -> Union[None, str]:
        return self._edited_by

    def acquire_edit_mode(self, edit_by: str) -> bool:
        if self._lock.acquire(blocking=True, timeout=1):
            if self.get_edited_by() is None:
                self._edited_by = edit_by
                self._lock.release()
                return True
            else:
                self._lock.release()
                return False
        else:
            return False

    def release_edit_mode(self):
        if self._lock.acquire(blocking=True, timeout=1):
            if self.get_edited_by() is not None:
                self._edited_by = None
                self.save()
                self._lock.release()
                return True
            else:
                self._lock.release()
                return False
        else:
            return False

    def to_dict(self) -> dict:
        return {
            "id": self.get_id(),
            "name": self.get_name(),
            "content": self.get_content(),
            "timestamp_create": self.get_timestamp_create(),
            "timestamp_edit": self.get_timestamp_edit()
        }

    def get_overview(self) -> dict:
        data = self.to_dict()
        data.update(self.get_state())
        return data

    def save(self, path: str = PATH):
        file = open(join(path, f"{self.get_name()}.json"), "w")
        json_str: str = json.dumps(self.to_dict(), indent=4)
        file.write(json_str)
        file.close()

    """
    @staticmethod
    def delete(name: str, path: str = PATH):
        filename: str = name
        if not filename.endswith(".json"):
            filename: str = f"{filename}.json"
        if isfile(join(path, filename)):
            remove(join(path, filename))
            del Blackboard._BLACKBOARDS[name]

    @staticmethod
    def load(filename: str, path: str = PATH):
        file = open(join(path, filename), "r")
        json_str: str = file.read()
        data: dict = json.loads(json_str)
        file.close()
        Blackboard(data["name"], data["content"], data["timestamp_create"], data["timestamp_edit"])

    @staticmethod
    def save_all(path: str = PATH):
        for blackboard in Blackboard._BLACKBOARDS:
            blackboard.save(path)

    @staticmethod
    def load_all(path: str = PATH):
        # reset internal storage
        Blackboard._BLACKBOARDS = {}
        files = [f for f in listdir(path) if isfile(join(path, f))]
        for filename in files:
            Blackboard.load(filename, path)

    @staticmethod
    def exists(name: str) -> bool:
        return name in Blackboard._BLACKBOARDS.keys()

    @staticmethod
    def get(name: str) -> 'Blackboard':
        return Blackboard._BLACKBOARDS[name]

    @staticmethod
    def get_all() -> List['Blackboard']:
        return list(Blackboard._BLACKBOARDS.values())
    """

    @staticmethod
    def exists_name(name: str) -> bool:
        for blackboard in Blackboard._BLACKBOARDS.values():
            if blackboard.get_name() == name:
                return True
        return False

    @staticmethod
    def delete_file(blackboard_id: int, path: str = PATH):
        filename: str = Blackboard._BLACKBOARDS[blackboard_id].name
        if not filename.endswith(".json"):
            filename: str = f"{filename}.json"
        if isfile(join(path, filename)):
            remove(join(path, filename))

    @staticmethod
    def delete(blackboard_id: int, path: str = PATH):
        # Delete JSON-File
        Blackboard.delete_file(blackboard_id, path)
        # Delete dict entry
        if blackboard_id in Blackboard._BLACKBOARDS.keys():
            del Blackboard._BLACKBOARDS[blackboard_id]

    @staticmethod
    def load(filename: str, path: str = PATH):
        file = open(join(path, filename), "r")
        json_str: str = file.read()
        data: dict = json.loads(json_str)
        file.close()
        Blackboard(data["name"], data["content"], data["timestamp_create"], data["timestamp_edit"], data["id"])

    @staticmethod
    def save_all(path: str = PATH):
        for blackboard in Blackboard._BLACKBOARDS:
            blackboard.save(path)

    @staticmethod
    def load_all(path: str = PATH):
        # reset internal storage
        Blackboard._BLACKBOARDS = {}
        files = [f for f in listdir(path) if isfile(join(path, f))]
        for filename in files:
            Blackboard.load(filename, path)

    @staticmethod
    def exists(blackboard_id: int) -> bool:
        return blackboard_id in Blackboard._BLACKBOARDS.keys()

    @staticmethod
    def get(blackboard_id: int) -> 'Blackboard':
        return Blackboard._BLACKBOARDS[blackboard_id]

    @staticmethod
    def get_by_name(name: str) -> Union['Blackboard', None]:
        for blackboard in Blackboard._BLACKBOARDS.values():
            if blackboard.get_name() == name:
                return blackboard
        return None

    @staticmethod
    def get_all() -> List['Blackboard']:
        return list(Blackboard._BLACKBOARDS.values())
