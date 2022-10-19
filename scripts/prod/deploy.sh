#!/bin/sh

# build and push
docker buildx build -f ./docker/Dockerfile.prod --platform linux/amd64,linux/arm64,linux/arm/v7 -t mritunjayupadhyay/school-management-api-prod:latest --push .