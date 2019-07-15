#!/usr/bin/env bash
BUILD=.build

if [[ -d "$BUILD" ]]; then
  sudo rm -r ${BUILD};
fi

NODE_ENV=$1 sls deploy
