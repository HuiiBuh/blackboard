FROM python:3.7

RUN mkdir /fastapi
WORKDIR /fastapi

COPY /src .
COPY requirements.txt ./

RUN pip install -r requirements.txt

CMD ["uvicorn", "server.__init__:app", "--host", "0.0.0.0", "--port", "80"]
