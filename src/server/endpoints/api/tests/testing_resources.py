import string, random, requests

endpoint = 'http://localhost:8000'

# FUNCTIONS
def rand_string(N, chars = string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(N))

def replaceMultiple(mainString, toBeReplaces, newString):
    # Iterate over the strings to be replaced
    for elem in toBeReplaces :
        # Check if string is in the main string
        if elem in mainString :
            # Replace the string
            mainString = mainString.replace(elem, newString)
    
    return  mainString

def clear_boards():
    response = requests.get(endpoint + '/api/blackboards')
    rjson = response.json()
    for board in rjson['blackboard_list']:
        response = requests.delete(endpoint + '/api/blackboards/' + board['id'])


# BOARD CREATION RESOURCES
name_viable_chars = string.ascii_lowercase + string.ascii_uppercase + string.digits + " -_"
name_not_viable_chars = replaceMultiple(string.printable, [char for char in name_viable_chars],'')

search_names = ["AFirstName",
                "TotallyRandomBoardName",
                "TotallyRandomName"] 
search_query = "Random"

correct_name = "aaa123"

random_id_length = 5000

name_min_chars = 3
name_max_chars = 64

content_max_length = 1048576

creation_names = ["TestBoard",
                "AnotherTestBoard",
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars)]

retrieve_names = [rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars)]

delete_name = rand_string(name_max_chars, name_viable_chars)
status_name = rand_string(name_max_chars, name_viable_chars)
acquire_names = [ rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars)]

update_names = [ rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars),
                rand_string(name_max_chars, name_viable_chars)]   





