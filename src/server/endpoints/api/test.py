import requests
import HtmlTestRunner
import unittest

# Import Tests
#from modules.boarderstellung import BoardErstellung
from tests.api_call_tests import *
from tests.testing_resources import clear_boards


if __name__ == "__main__":
    clear_boards()
    unittest.TestLoader.sortTestMethodsUsing = None
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='./testReports'))
