import json
import re
import time
from os import listdir, remove
from os.path import isfile, join
from threading import Lock
from typing import Union, List

from uuid import uuid1


class Blackboard:
    # Dictionary containing all Blackboard objects.
    _BLACKBOARDS = {}

    PATH = join(join(".", "server"), "db")

    # RegEx for finding any character which is not(^) a-z or A-Z or 0-9 or '-' or '_' or space
    _NAME_PATTERN = re.compile("[^ a-zA-Z0-9_-]")
    _MIN_NAME_LENGTH = 3
    _MAX_NAME_LENGTH = 64

    _MIN_CONTENT_LENGTH = 0
    _MAX_CONTENT_LENGTH = 1048576

    # 5 minutes til timeout
    _TIMEOUT = 60 * 5 + 10

    def __init__(self, name: str, content: Union[None, str] = None, timestamp_create: float = 0,
                 timestamp_edit: float = 0, blackboard_id: Union[None, str] = None):
        if Blackboard.exists_name(name):
            raise IndexError(f"Blackboard with name '{name}' already exists!")

        if Blackboard._NAME_PATTERN.findall(name):
            raise ValueError("Name should only consist of a-z, A-Z, 0-9, '-', '_' or space.")

        if not Blackboard._MIN_NAME_LENGTH <= len(name) <= Blackboard._MAX_NAME_LENGTH:
            raise ValueError(f"Name should have a length of:"
                             f" {Blackboard._MIN_NAME_LENGTH} <= length <= {Blackboard._MAX_NAME_LENGTH}")

        # Set ID
        self._id = blackboard_id or uuid1().hex

        self._name: str = name
        self._content: Union[None, str] = content
        self._timestamp_create: float = timestamp_create
        self._timestamp_edit: float = timestamp_edit
        self._edited_by: Union[None, str] = None

        # Create new timestamps when blackboard is newly created
        if self._timestamp_create == 0:
            self._timestamp_create = time.time()
        if self._timestamp_edit == 0:
            self._timestamp_edit = time.time()

        self._lock = Lock()
        self._timeout = None

        # Save blackboard in JSON-File
        self.save()

        Blackboard._BLACKBOARDS[self._id] = self

    def get_id(self) -> str:
        """
        Returns the id of the blackboard.
        :return: str
        """
        return self._id

    def set_name(self, name: str) -> None:
        """
        Change the name of the blackboard.
        :param name: New name of the blackboard.
        :return: None
        """
        if Blackboard._NAME_PATTERN.findall(name):
            raise ValueError("Name should only consist of a-z, A-Z, 0-9, '-', '_' or space.")

        if not Blackboard._MIN_NAME_LENGTH <= len(name) <= Blackboard._MAX_NAME_LENGTH:
            raise ValueError(f"Name should have a length of:"
                             f" {Blackboard._MIN_NAME_LENGTH} <= length <= {Blackboard._MAX_NAME_LENGTH}")

        if Blackboard.exists_name(name):
            raise IndexError(f"Blackboard with name '{name}' already exists!")

        Blackboard.delete_file(self.get_id())

        self._name = name
        self._timestamp_edit = time.time()

        self.save()

    def get_name(self) -> str:
        """
        Return name of the blackboard.
        :return: str
        """
        return self._name

    def set_content(self, content: Union[None, str]) -> None:
        """
        Change the content of the blackboard.
        :param content: New content of the blackboard.
        :return: None
        """

        if isinstance(content, str) and not content:
            content = None

        if content is not None and not Blackboard._MIN_CONTENT_LENGTH < len(content) < Blackboard._MAX_CONTENT_LENGTH:
            raise ValueError(f"Content size should be: "
                             f"{Blackboard._MIN_CONTENT_LENGTH} <= length <= {Blackboard._MAX_CONTENT_LENGTH}")

        self._content = content
        self._timestamp_edit = time.time()

        self.save()

    def get_content(self) -> Union[None, str]:
        """
        Return content of the blackboard.
        :return: str or None
        """
        return self._content

    def get_timestamp_create(self) -> float:
        """
        Return timestamp_create of blackboard.
        :return: float
        """
        return self._timestamp_create

    def get_timestamp_edit(self) -> float:
        """
        Return timestamp_edit of blackboard.
        :return: float
        """
        return self._timestamp_edit

    def get_state(self) -> dict:
        """
        Return state of the blackboard in form of a dictionary. It contains:
        - is_empty: True or False, whether the blackboard has a content or not.
        - is_edit: True or False, whether the blackboard is currently in use or not.
        - timestamp_edit: When the blackboard was lastly edited.
        - timeout: Timeout of blackboard lock.
        :return: dict
        """
        return {
            "is_empty": self.get_content() is None,
            "is_edit": self.get_edited_by() is not None,
            "timestamp_edit": self.get_timestamp_edit(),
            "timeout": self.get_timeout_in_sec() if self.has_timeout() else None
        }

    def get_edited_by(self) -> Union[None, str]:
        """
        Return the token of the user currently editing the blackboard.
        :return: str or None
        """
        return self._edited_by

    def get_timeout(self) -> Union[None, float]:
        """
        Return remaining timeout of blackboard lock in milliseconds if set.
        :return: float or None
        """
        return self._timeout

    def has_timeout(self) -> bool:
        """
        Check if a lock timeout is set.
        :return: bool
        """
        return self._timeout is not None

    def get_timeout_in_sec(self) -> int:
        """
        Return remaining timeout of blackboard lock in seconds if set.
        :return: int
        """
        return int(self._timeout - time.time())

    def acquire_edit_mode(self, edit_by: str) -> bool:
        """
        Lock the blackboard for editing.
        :param edit_by: Token of the user currently editing the blackboard
        :return: bool
        """
        if self._lock.acquire(blocking=True, timeout=1):
            if self.get_edited_by() is None or self.get_edited_by() == edit_by:
                self._edited_by = edit_by
                self._lock.release()
                self._timeout = time.time() + Blackboard._TIMEOUT
                return True
            else:
                self._lock.release()
                return False
        else:
            return False

    def release_edit_mode(self) -> bool:
        """
        Release lock of blackboard.
        :return: bool
        """
        if self._lock.acquire(blocking=True, timeout=1):
            if self.get_edited_by() is not None:
                self._edited_by = None
                self.save()
                self._lock.release()
                self._timeout = None
                return True
            else:
                self._lock.release()
                return False
        else:
            return False

    def to_dict(self) -> dict:
        """
        Convert blackboard to dictionary with the following information:
        - id: ID of the blackboard
        - name: Name of the blackboard
        - content: Content of the blackboard
        - timestamp_create: Time, when blackboard was created
        - timestamp_edit: Time, when blackboard was lastly edited
        :return: dict
        """
        return {
            "id": self.get_id(),
            "name": self.get_name(),
            "content": self.get_content(),
            "timestamp_create": self.get_timestamp_create(),
            "timestamp_edit": self.get_timestamp_edit()
        }

    def get_overview(self) -> dict:
        """
        Return overview of the blackboard. Merges to information of Blackboard.to_dict() and
        Blackboard.get_state() to a single dictionary.
        :return: dict
        """
        data = self.to_dict()
        data.update(self.get_state())
        return data

    def save(self, path: str = PATH) -> None:
        """
        Write blackboard to a JSON-File.
        :param path: Path of the JSON-File
        :return: None
        """
        file = open(join(path, f"{self.get_name()}.json"), "w")
        json_str: str = json.dumps(self.to_dict(), indent=4)
        file.write(json_str)
        file.close()

    @staticmethod
    def exists_name(name: str) -> bool:
        """
        Check if there is already a blackboard with the given name.
        :param name: Name to be checked
        :return: bool
        """
        for blackboard in Blackboard._BLACKBOARDS.values():
            if blackboard.get_name() == name:
                return True
        return False

    @staticmethod
    def delete_file(blackboard_id: str, path: str = PATH) -> None:
        """
        Delete JSON-File of the blackboard with the given ID.
        :param blackboard_id: ID of blackboard to be deleted
        :param path: Path of the JSON-File
        :return: None
        """
        filename: str = Blackboard._BLACKBOARDS[blackboard_id].get_name()
        if not filename.endswith(".json"):
            filename: str = f"{filename}.json"
        if isfile(join(path, filename)):
            remove(join(path, filename))

    @staticmethod
    def delete(blackboard_id: str, path: str = PATH) -> None:
        """
        Delete blackboard with the given id
        :param blackboard_id:
        :param path:
        :return:
        """
        # Delete JSON-File
        Blackboard.delete_file(blackboard_id, path)
        # Delete dict entry
        if blackboard_id in Blackboard._BLACKBOARDS.keys():
            del Blackboard._BLACKBOARDS[blackboard_id]

    @staticmethod
    def load(filename: str, path: str = PATH) -> None:
        """
        Load specific JSON-File to retrieve saved blackboard.
        :param filename: Name of the JSON-File
        :param path: Path of the JSON-File
        :return: None
        """
        file = open(join(path, filename), "r")
        json_str: str = file.read()
        data: dict = json.loads(json_str)
        file.close()
        Blackboard(data["name"], data["content"], data["timestamp_create"], data["timestamp_edit"], data["id"])

    @staticmethod
    def save_all(path: str = PATH) -> None:
        """
        Save all blackboards in JSON-Files.
        :param path: Path for the JSON-Files
        :return: None
        """
        for blackboard in Blackboard._BLACKBOARDS:
            blackboard.save(path)

    @staticmethod
    def load_all(path: str = PATH) -> None:
        """
        Load all existing JSON-Files to retrieve all saved blackboard.
        :param path: Path of the JSON-Files
        :return: None
        """
        # reset internal storage
        Blackboard._BLACKBOARDS = {}
        files = [f for f in listdir(path) if isfile(join(path, f))]
        for filename in files:
            if filename.endswith(".json"):
                Blackboard.load(filename, path)

    @staticmethod
    def exists(blackboard_id: str) -> bool:
        """
        Check if blackboard with the given ID exists.
        :param blackboard_id: ID of the blackboard
        :return: bool
        """
        return blackboard_id in Blackboard._BLACKBOARDS.keys()

    @staticmethod
    def get(blackboard_id: str) -> 'Blackboard':
        """
        Return blackboard object for the given ID.
        :param blackboard_id: ID of the blackboard
        :return: Blackboard object
        """
        return Blackboard._BLACKBOARDS[blackboard_id]

    @staticmethod
    def get_by_name(name: str) -> Union['Blackboard', None]:
        """
        Return blackboard object for the given name.
        :param name: Name of the blackboard
        :return: Blackboard object or None
        """
        for blackboard in Blackboard._BLACKBOARDS.values():
            if blackboard.get_name() == name:
                return blackboard
        return None

    @staticmethod
    def get_all() -> List['Blackboard']:
        """
        Return a list of all blackboard objects.
        :return: List of Blackboard objects
        """
        return list(Blackboard._BLACKBOARDS.values())

    @staticmethod
    def search(q: str) -> List['Blackboard']:
        """
        Return blackboards where q is part of their names.
        :param q: String to search for in the blackboard names
        :return: List of Blackboard objects
        """
        blackboard_list: List[Blackboard] = []

        for blackboard in Blackboard._BLACKBOARDS.values():
            if q.lower() in blackboard.get_name().lower():
                blackboard_list.append(blackboard)

        return blackboard_list
