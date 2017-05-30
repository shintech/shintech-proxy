#!/usr/bin/env bash

if [ -d "node_modules" ] || [ -d "build" ]; then
  echo "Removing existing files..."
  rm -rv node_modules build --force
fi

echo "Creating file directories..." && \
mkdir build && \

printf "\nInstalling packages...\n" && \
yarn install && \

printf "\nBuilding in progress...\nPlease wait...\n\n" && \
npm run -s build && \

printf "All done...\n"
