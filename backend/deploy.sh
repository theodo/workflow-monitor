#!/usr/bin/env bash
BUILD=.build

# build is shared between sls offline (in the docker) and sls deploy
# The docker create .build as root so when deploying sls can not overide the .build
if [[ -d "$BUILD" ]]; then
  sudo rm -r ${BUILD};
fi

NODE_ENV=$1 sls deploy
