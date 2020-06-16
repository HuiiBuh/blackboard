
import unittest
import requests
import time

import string

from tests.testing_resources import name_min_chars, name_max_chars, rand_string, name_viable_chars, name_not_viable_chars, endpoint, random_id_length, clear_boards, correct_name, content_max_length
from tests.testing_resources import creation_names, retrieve_names, delete_name, status_name, acquire_names, update_names, search_query, search_names


class SchnittstelleBoarderstellung(unittest.TestCase):


    def test_ID_1(self):
        """ Einfache Erstellung des Boards 'TestBoard' """

        # Board creation call
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": creation_names[0]})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(content)

    def test_ID_2(self):
        """ Einfache Erstellung des Boards “AnotherTestBoard ”"""

        # Board creation call
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": creation_names[1]})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(content)

    def test_ID_3(self):
        """ Test mit zufälligem Namen minimaler Länge """

        # Board creation call
        response = requests.post(endpoint + '/api/blackboards', json={
                                 "name": rand_string(chars=name_viable_chars, N=name_min_chars)})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(content)

    def test_ID_4(self):
        """ Test mit zufälligem Namen maximaler Länge """

        # Board creation call
        response = requests.post(endpoint + '/api/blackboards', json={
                                 "name":  rand_string(chars=name_viable_chars, N=name_max_chars)})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(content)

    def test_ID_5(self):
        """ Test mit zufälligem Namen minimaler Länge - 1 """

        # Board creation call
        response = requests.post(endpoint + '/api/blackboards', json={
                                 "name": rand_string(chars=name_viable_chars, N=name_min_chars - 1)})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])

    def test_ID_6(self):
        """ Test mit zufälligem Namen maximaler Länge + 1 """

        # Board creation call
        response = requests.post(endpoint + '/api/blackboards', json={
                                 "name":  rand_string(chars=name_viable_chars, N=name_max_chars + 1)})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])

    def test_ID_7(self):
        """ Test mit unzulässigem ASCII-Zeichen """

        # Board creation call
        for char in name_not_viable_chars:
            response = requests.post(
                endpoint + '/api/blackboards', json={"name":  'abc' + char})
            content = response.json()

            # Assertions
            self.assertEqual(response.status_code, 406)
            self.assertIsNotNone(content['detail'])

    def test_ID_8(self):
        """ Test ohne Namensübergabe """

        # Board creation call
        response = requests.post(
            endpoint + '/api/blackboards', json={"wrong": "request"})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content['detail'])

    def test_ID_9(self):
        """ Test mit fehlerhaftem Body """

        # Board creation call
        response = requests.post(endpoint + '/api/blackboards', json={123:123})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content['detail'])

    def test_ID_10(self):
        """ Test mit falschem Datentyp Array """

        # Board creation call
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": ["123", "123"]})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content['detail'])


    def test_ID_11(self):
        """ Doppelerstellung mit gleichem  Namen """

        # Board creation call 1
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": creation_names[3]})
        # Make sure that the board has been created
        self.assertEqual(response.status_code, 201)

        # Board creation call 2
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": creation_names[3]})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])  

class SchnittstelleBoardabruf(unittest.TestCase):

    def generate_board(self, name):
        # ONLY VALID FUNCTION AFTER test_ID_3 HAS BEEN SUCCESSFULL
        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": name})
        self.assertEqual(response.status_code, 201)

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Find board by given name
        board = [x for x in content["blackboard_list"] if x["name"] == name][0]

        # Return board object
        self.assertIsNotNone(board)
        return board

    def validate_list_entry_strucutre(self, entry):
        self.assertIsNotNone(entry["id"])
        # Content is none by deault, cannot be tested
        self.assertTrue("content" in entry)
        self.assertIsNotNone(entry["timestamp_create"])
        self.assertIsNotNone(entry["timestamp_edit"])
        self.assertIsNotNone(entry["is_empty"])
        self.assertIsNotNone(entry["is_edit"])

    def validate_board_strucutre(self, entry):
        self.assertIsNotNone(entry["id"])
        #Content is none by deault
        self.assertTrue("content" in entry)
        self.assertIsNotNone(entry["timestamp_create"])
        self.assertIsNotNone(entry["timestamp_edit"])

    def test_ID_1(self):
        """ Abruf aller Bords, vor Erstellung """

        # Get boards call
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertTrue('blackboard_list' in content)

    def test_ID_2(self):
        """ Abruf eines Bords, vor Erstellung """
        response = requests.get(endpoint + '/api/blackboards/' + correct_name)
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(content['detail'])
    

    def test_ID_3(self):
        """ Abruf aller Bords, nach Erstellung eines Boards """

        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": retrieve_names[0]})

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Make sure that Response is correct
        self.assertEqual(response.status_code, 200)
        self.assertTrue('blackboard_list' in content)

        # Check if created Board is in List
        board = [x for x in content["blackboard_list"] if x["name"] == retrieve_names[0]][0]

        # Assertions
        self.assertIsNotNone(board)
        self.validate_list_entry_strucutre(board)
        
    def test_ID_4(self):
        """ Abruf aller Bords, nach Erstellung  mehrerer Boards """
        # Generate Boards for testing
        board = self.generate_board(retrieve_names[1])
        board2 = self.generate_board(retrieve_names[2])

        # Get Boards call
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Assert if call successfull
        self.assertEqual(response.status_code, 200)
        self.assertTrue('blackboard_list' in content)

        # Assert if created boards are in retrieved lsit
        self.assertTrue( board in content['blackboard_list'])
        self.assertTrue( board2 in content['blackboard_list'])


    def test_ID_5(self):
        """ Abruf eines Boards, nach Erstellung """

        # Get board for testing
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Make sure response is correct
        self.assertEqual(response.status_code, 200)
        self.assertTrue('blackboard_list' in content)

        # Select Board for test
        board = content["blackboard_list"][0]
        
        # Retrieve Board status via ID
        response = requests.get(endpoint + '/api/blackboards/' + board["id"])
        content = response.json()

        # Chec kResposne structure
        self.validate_board_strucutre(content)

class SchnittstelleBoardloeschen(unittest.TestCase):


    def test_ID_1(self):
        """ Löschen eines Boards mit ungültiger ID """

        # Delete Board call
        response = requests.delete(endpoint + '/api/blackboards/' + correct_name)
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(content['detail'])

    def test_ID_2(self):
        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": delete_name})
        self.assertEqual(response.status_code, 201)

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Select single board
        board = [x for x in content["blackboard_list"] if x["name"] == delete_name][0]
        self.assertIsNotNone(board)

        # Delete Board
        response = requests.delete(endpoint + '/api/blackboards/' + board["id"])
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(content)

class SchnittstelleBoardStatus(unittest.TestCase):
    def setUp(self):
        clear_boards()

    def validate_status_structure(self, status):
        self.assertTrue( "is_empty" in status )
        self.assertTrue( "is_edit"in status )
        self.assertTrue( "timestamp_edit" in status )
        self.assertTrue( "timeout" in status )

    def test_ID_1(self):
        """ Abruf eines Board Status mit nicht vorhandener ID """
        response = requests.get(endpoint + '/api/blackboards/'+ correct_name +'/status')
        content = response.json()

        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(content['detail'])

    def test_ID_2(self):
        """ Abruf eines Board Status """
        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": status_name})
        self.assertEqual(response.status_code, 201)

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        board = [x for x in content["blackboard_list"] if x["name"] == status_name][0]
        self.assertIsNotNone(board)

        response = requests.get(endpoint + '/api/blackboards/' + board["id"] + '/status')
        content = response.json()

        self.assertEqual(response.status_code, 200)
        self.validate_status_structure(content)

# Boards könntent nach diesen Tests noch gesperrt sein
class SchnittstelleBoardAkquirierung(unittest.TestCase):
    def setUp(self):
        clear_boards()

    tokens = []

    def generate_board(self, name):
        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": name})
        self.assertEqual(response.status_code, 201)

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Select board by name and return
        board = [x for x in content["blackboard_list"] if x["name"] == name][0]
        self.assertIsNotNone(board)
        return board

    def test_ID_1(self):
        """ Boardaquise mit nicht vorhandener ID """

        # Acquire call
        response = requests.get(endpoint + '/api/blackboards/'+ correct_name + '/acquire')
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(content['detail'])

    def test_ID_2(self):
        """ Boardaquise mit  ID """

        # delete existing boards
        clear_boards()

        # Generate Board for testing
        board = self.generate_board(acquire_names[0])

        # Acquire call
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire')
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 202)
        self.assertIsNotNone(content)
        self.assertIsNotNone(content["token"])
        self.assertIsNotNone(content["timeout"])

    def test_ID_3(self):
        """ Refreshing des Timeouts """

        # Generate Board for testing
        board = self.generate_board(acquire_names[1])

        # Acquire call
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire')
        content = response.json()

        # Check Response
        self.assertEqual(response.status_code, 202)
        self.assertIsNotNone(content)

        # Acquire call
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire?token=' + content["token"])
        content = response.json()

        # Check refreshed Response
        self.assertIsNotNone(content["token"])
        self.assertIsNotNone(content["timeout"])
        

    def test_ID_4(self):
        """ Aqkuirierung eines bereits gelockten Boards """

        # Generate Board for testing
        board = self.generate_board(acquire_names[2])
        
        # Acquire call
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire')
        content = response.json()

        # Check Response
        self.assertEqual(response.status_code, 202)
        self.assertIsNotNone(content)

        # Acquire call
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire')
        content = response.json()


        # Check if ubnsuccessfull
        self.assertEqual(response.status_code, 423)
        self.assertIsNotNone(content)

    def test_ID_5(self):
        """ Release eiens Boards mit nicht vorhandener ID """

        # Release call
        response = requests.put(endpoint + '/api/blackboards/'+ correct_name +'/release', json={"token":"aaa"})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(content)

    def test_ID_6(self):
        """ Release eines Boards """

        # Generate Board for testing
        board = self.generate_board(acquire_names[3])

        # Acquire board and check if acquisition worked
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire')
        content = response.json()
        self.assertEqual(response.status_code, 202)
        self.assertIsNotNone(content)
        
        # Relese using token
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] +'/release', json={"token": content["token"]})
        content = response.json()

        # Assert if release worked
        self.assertEqual(response.status_code, 202)
        self.assertIsNone(content)

    def test_ID_7(self):
        """ Release mit falschem Token """

         # Generate Board for testing
        board = self.generate_board(acquire_names[4])


        # Acquire board and check if acquisition worked
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] +'/acquire')
        content = response.json()
        self.assertEqual(response.status_code, 202)
        self.assertIsNotNone(content)
        
        # Release ussing a wrong token
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] +'/release', json={"token": content["token"] + "aaa"})
        content = response.json()

        # Check fi unsuccessfull
        self.assertEqual(response.status_code, 403)
        self.assertIsNotNone(content)

    def test_ID_8(self):
        """ Release mit fehlendem Token """

         # Generate Board for testing
        board = self.generate_board(acquire_names[5])

        # Release call without token
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] +'/release')
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content)
        
class SchnittstelleBoardUpdate(unittest.TestCase):

    def setUp(self):
        clear_boards()

    def generate_board(self, name):
        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": name})
        self.assertEqual(response.status_code, 201)

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Select Board via name and return
        board = [x for x in content["blackboard_list"] if x["name"] == name][0]
        self.assertIsNotNone(board)
        return board


    def test_ID_1(self):
        """ Boardupdate mit nicht vorhandener ID """

        # Update call
        response = requests.put(endpoint + '/api/blackboards/'+ correct_name + '/update', json={"token":"aaa", "content": "aaa", "name": correct_name})
        content = response.json()

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertIsNotNone(content['detail'])

    def test_ID_2(self):
        """ Boardupdate mit fehlerhaften Paramtern """

        # Generate Board for testing
        board = self.generate_board(update_names[0])

        # Update call, missing token param
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"name":"aaa", "content": "aaa"})
        content = response.json()

        # Check if unsuccesfull
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content['detail'])

        # Update call, missing name param
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":"aaa", "content": "aaa"})
        content = response.json()

        # Check if unsuccesfull
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content['detail'])

    def test_ID_3(self):
        """ Boardupdate ohne token"""

        # Generate Board for testing
        board = self.generate_board(update_names[1])

        # Update call
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":"aaa", "content": "aaa", "name": rand_string(name_max_chars + 1, name_viable_chars)})
        content = response.json()

        # Assert unsuccessfull
        self.assertEqual(response.status_code, 403)
        self.assertIsNotNone(content['detail'])

    def test_ID_4(self):
        """ Update mit namen maximaler Länge + 1 """

        # Generate Board for testing
        board = self.generate_board(update_names[2])

        # Acquire token to allow update
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] + '/acquire')
        content = response.json()
        token = content["token"]

        # Update with invalid name
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":token, "content": "aaa", "name": rand_string(name_max_chars + 1, name_viable_chars)})
        content = response.json()

        # Assert Failure
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])

    def test_ID_5(self):
        """ Update mit namen minimaler Länge - 1 """
        # Generate Board for testing
        board = self.generate_board(update_names[3])

        # Acquire token to allow update
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] + '/acquire')
        content = response.json()
        token = content["token"]

        # Update with invalid name
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":token, "content": "aaa", "name": rand_string(name_min_chars - 1, name_viable_chars)})
        content = response.json()

        # Assert Failure
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])

    def test_ID_6(self):
        """ Update mit namen mit nicht erlaubten Zeichen """
        # Generate Board for testing
        board = self.generate_board(update_names[4])

        # Acquire token to allow update
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] + '/acquire')
        content = response.json()
        token = content["token"]

        # Check name update with all invalid chars
        for char in name_not_viable_chars:
            
            # send request with name + 1 invalid char
            response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":token, "content": "aaa", "name": "aaa" + char})
            content = response.json()

            # Assert Failure
            self.assertEqual(response.status_code, 406)
            self.assertIsNotNone(content['detail'])

    def test_ID_7(self):
        """ Update mit bereits existierendem Namen """

        # Generate Boards for testing
        board = self.generate_board(update_names[5])
        board2 = self.generate_board(update_names[6])

        # Acquire token to allow update
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] + '/acquire')
        content = response.json()
        token = content["token"]

        # Update with invalid name
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":token, "content": "aaa", "name": board2["name"]})
        content = response.json()

        # Assert Failure
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])

    def test_ID_8(self):
        """ Update mit bereits existierendem Namen """

        # Generate Board for testing
        board = self.generate_board(update_names[7])

        # Acquire token to allow update
        response = requests.get(endpoint + '/api/blackboards/'+ board["id"] + '/acquire')
        content = response.json()
        token = content["token"]

        # Update with invalid content
        response = requests.put(endpoint + '/api/blackboards/'+ board["id"] + '/update', json={"token":token, "content": rand_string(content_max_length + 1), "name": rand_string(20)})
        content = response.json()

        # Assert Failure
        self.assertEqual(response.status_code, 406)
        self.assertIsNotNone(content['detail'])

class SchnittstelleBoardSuche(unittest.TestCase):
    def setUp(self):
        clear_boards()

    def validate_list_entry_strucutre(self, entry):
        self.assertIsNotNone(entry["id"])
        # Content is none by deault, cannot be tested
        self.assertIsNotNone("content" in entrycontent)
        self.assertIsNotNone(entry["timestamp_create"])
        self.assertIsNotNone(entry["timestamp_edit"])
        self.assertIsNotNone(entry["is_empty"])
        self.assertIsNotNone(entry["is_edit"])

    def generate_board(self, name):
        # Board creation
        response = requests.post(
            endpoint + '/api/blackboards', json={"name": name})
        self.assertEqual(response.status_code, 201)

        # Get Boards
        response = requests.get(endpoint + '/api/blackboards')
        content = response.json()

        # Select Board via name and return
        board = [x for x in content["blackboard_list"] if x["name"] == name][0]
        self.assertIsNotNone(board)
        return board

    def test_ID_1(self):
        """ Suche ohne Query String """
        # Search request wihtout param q
        response = requests.get( endpoint + '/api/search')
        content = response.json()

        # Assert Failure
        self.assertEqual(response.status_code, 422)
        self.assertIsNotNone(content["detail"])

    
    def test_ID_2(self):
        """ Suche mit Namen  """

        # generate board
        board = self.generate_board(search_names[0])

        # Search request with single result
        response = requests.get( endpoint + '/api/search?q=' + search_names[0])
        content = response.json()

        # Chekf if response correct
        self.assertEqual(response.status_code, 200)
        self.assertTrue( "blackboard_list" in content )

        # Assert if board found via search
        self.assertTrue(board in content["blackboard_list"])

    def test_ID_3(self):
        """ Suche mit wildcard Namen  """

        # Generate Boards for testing
        board = self.generate_board(search_names[1])
        board2 = self.generate_board(search_names[2])

        # search request with multiple results
        response = requests.get( endpoint + '/api/search?q=' + search_query)
        content = response.json()

        # Chekf if response correct
        self.assertEqual(response.status_code, 200)
        self.assertTrue( "blackboard_list" in content)

        # Assert if board found via search
        self.assertTrue(board in content["blackboard_list"])
        self.assertTrue(board2 in content["blackboard_list"])
        
