import uvicorn

if __name__ == "__main__":
    # Import string, but with : instead of .
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
