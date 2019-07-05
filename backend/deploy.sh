#!/usr/bin/env bash
BUILD=.build

if [[ -d "$BUILD" ]]; then
  rm -r ${BUILD};
fi

NODE_ENV=$1 sls deploy
