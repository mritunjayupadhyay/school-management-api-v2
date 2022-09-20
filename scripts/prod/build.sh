#!/bin/sh

docker build --tag mritunjayupadhyay/school-management-api-prod -f ./docker/Dockerfile.prod .
docker push mritunjayupadhyay/school-management-api-prod