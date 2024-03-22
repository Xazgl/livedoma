#!/bin/bash

# If there is no docker-compose.prod.yml in the current directory, cd to the parent directory
if [ ! -f docker-compose.prod.yml ]; then
  cd ..
fi

# Create the /home/livedoma/ directory on the remote host livedoma if it doesn't exist
ssh livedoma "mkdir -p /home/livedoma"

# Upload the docker-compose.prod.yml file to the remote host livedoma
# Check if no diff between last commit and current state of docker-compose.prod.yml in working directory
# If there is no diff, then do not upload the file
# if [ -z "$(git diff --name-only HEAD docker-compose.prod.yml)" ]; then
#   echo "No changes detected in docker-compose.prod.yml, skipping upload."
# else
  scp docker-compose.prod.yml livedoma:/home/livedoma/
# fi


# Upload the .env.prod file to the remote host livedoma
scp .env.prod livedoma:/home/livedoma/

# Set file permissions on the remote host livedoma
ssh livedoma "chmod 600 /home/livedoma/.env.prod"

# Upload nginx folder to the remote host livedoma
# scp -r nginx livedoma:/home/livedoma/

# Restart the Docker containers on the remote host livedoma
ssh livedoma "cd /home/livedoma/ && docker compose -f docker-compose.prod.yml up -d"