import requests
import pytest
import json
import random
import string
import re
import sys
import unittest
import HtmlTestRunner

# Import Tests
from boarderstellung import BoardErstellung

endpoint = 'http://localhost:8000'

def clear_boards():
    response = requests.get(endpoint + '/api/blackboards')
    rjson = response.json()
    for board in rjson['blackboard_list']:
        response = requests.delete(endpoint + '/api/blackboards/'+ board['id'])

if __name__ == "__main__":
    clear_boards()
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner())
