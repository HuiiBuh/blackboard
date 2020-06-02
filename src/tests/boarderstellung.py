import unittest,string,requests,random

def replaceMultiple(mainString, toBeReplaces, newString):
    # Iterate over the strings to be replaced
    for elem in toBeReplaces :
        # Check if string is in the main string
        if elem in mainString :
            # Replace the string
            mainString = mainString.replace(elem, newString)
    
    return  mainString


name_viable_chars = string.ascii_lowercase + string.ascii_uppercase + string.digits + " -_";
name_not_viable_chars = replaceMultiple(string.printable, [char for char in name_viable_chars],'')
name_min_chars = 3
name_max_chars = 32
endpoint = 'http://localhost:8000'

def rand_string(chars = string.ascii_uppercase + string.digits, N=10):
    return ''.join(random.choice(chars) for _ in range(N))

class BoardErstellung(unittest.TestCase):

    def test_ID_1(self):
        """ Einfache Erstellung des Boards 'TestBoard' """
        response = requests.post(endpoint + '/api/blackboards', json={"name": "TestBoard"})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.content, b'null')


    def test_ID_2(self):
        """ Einfache Erstellung des Boards “AnotherTestBoard ”"""
        response = requests.post(endpoint + '/api/blackboards', json={"name": "AnotherTestBoard"})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.content, b'null')


    def test_ID_3(self):
        """ Doppelerstellung eines Boards """
        response = requests.post(endpoint + '/api/blackboards', json={"name": "TestBoard"})

        self.assertEqual(response.status_code, 406)
        self.assertEqual(response.content, b'{"detail":"Blackboard with name \'TestBoard\' already exists!"}')


    def test_ID_4(self):
        """ Test mit zufälligem Namen minimaler Länge """
        response = requests.post(endpoint + '/api/blackboards', json={"name": rand_string(chars=name_viable_chars, N=name_min_chars)})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.content, b'null')

    
    def test_ID_5(self):
        """ Test mit zufälligem Namen maximaler Länge """
        response = requests.post(endpoint + '/api/blackboards', json={"name":  rand_string(chars=name_viable_chars, N=name_max_chars)})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.content, b'null')


    def test_ID_6(self):
        """ Test mit zufälligem Namen minimaler Länge - 1 """
        response = requests.post(endpoint + '/api/blackboards', json={"name": rand_string(chars=name_viable_chars, N=name_min_chars - 1)})

        self.assertEqual(response.status_code, 406)
        self.assertEqual(response.content, b'{"detail":"Name should have a length of: 3 <= length <= 32"}')

    
    def test_ID_7(self):
        """ Test mit zufälligem Namen maximaler Länge + 1 """
        response = requests.post(endpoint + '/api/blackboards', json={"name":  rand_string(chars=name_viable_chars, N=name_max_chars + 1)})

        self.assertEqual(response.status_code, 406)
        self.assertEqual(response.content, b'{"detail":"Name should have a length of: 3 <= length <= 32"}')


    def test_ID_8(self):
        """ Test mit unzulässigem ASCII-Zeichen """
        for char in name_not_viable_chars:
            response = requests.post( endpoint + '/api/blackboards', json={"name":  'abc' + char} )
            
            self.assertEqual(response.status_code, 406)
            self.assertEqual(response.content, b'{"detail":"Name should only consist of a-z, A-Z, 0-9, \'-\', \'_\' or space."}')


    def test_ID_9(self):
        """ Test ohne Namensübergabe """
        response = requests.post(endpoint + '/api/blackboards', json={"wrong":"request"})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.content, b'{"detail":[{"loc":["body","body_data","name"],"msg":"field required","type":"value_error.missing"}]}')


    def test_ID_10(self):
        """ Test mit fehlerhaftem Body """
        response = requests.post(endpoint + '/api/blackboards', {123:123})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b'{"detail":"There was an error parsing the body"}')

    def test_ID_11(self):
        """ Test mit falschem Datentyp Array """
        response = requests.post(endpoint + '/api/blackboards', json={"name":["123", "123"]})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.content, b'{"detail":[{"loc":["body","body_data","name"],"msg":"str type expected","type":"type_error.str"}]}')