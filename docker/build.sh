#!/usr/bin/env bash

cp -r ../src/static/ nginx/
cp -r ../src/ fastapi/
cp ../requirements.txt fastapi/

docker-compose build

rm -r nginx/static
rm -r fastapi/src/
rm fastapi/requirements.txt