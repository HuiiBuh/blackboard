from .blackboard import Blackboard
from threading import Thread
import time

# Load all existing blackboards
Blackboard.load_all()


def check_timeouts():
    while True:
        time.sleep(1)
        for bb in Blackboard.get_all():
            if bb.has_timeout():
                sec = bb.get_timeout_in_sec()
                if sec <= 0:
                    bb.release_edit_mode()


check_thread = Thread(target=check_timeouts)
check_thread.setName("Timeout Checker")
check_thread.start()
