#!/bin/sh

docker build --tag mritunjayupadhyay/school-management-api-dev -f ./docker/Dockerfile.dev .
docker push mritunjayupadhyay/school-management-api-dev