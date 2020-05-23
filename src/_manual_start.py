import uvicorn

from server.data.blackboard import Blackboard

if __name__ == "__main__":
    Blackboard.load_all()

    name = "Klapptes"
    a = Blackboard.exists(name)
    if Blackboard.exists(name):
        bb = Blackboard.get(name)
    else:
        bb = Blackboard("Klapptes")

    print(bb.to_dict())

    # TODO: Removed because i have to delete the esklappt json every time I restart the server
    # bb.set_name("Esklappt")

    # TODO: Can't see blackboard 'Esklappt' on website. Reason? See github issue #2

    # Import string, but with : instead of .
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
