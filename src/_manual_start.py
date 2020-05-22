import uvicorn
from src.server.data.blackboard import Blackboard

if __name__ == "__main__":
    Blackboard.load_all()
    name = "Klapptes"
    if Blackboard.exists(name):
        bb = Blackboard.get(name)
    else:
        bb = Blackboard("Klapptes")

    print(bb.to_dict())

    bb.set_name("Esklappt!")


    # Import string, but with : instead of .
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
