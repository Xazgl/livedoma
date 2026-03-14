#!/bin/bash

# connect to the remote host and pull the latest image from the GitLab registry
ssh livedoma-new "cd /home/livedoma && docker compose -f docker-compose.prod.yml pull"

# connect to the remote host and restart the Docker containers
ssh livedoma-new "cd /home/livedoma && docker compose -f docker-compose.prod.yml up -d"

