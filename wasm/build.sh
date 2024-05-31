#!/bin/sh

set -xe

clang -Wall -Wextra -Ilemon --target=wasm32 -o blueberry.o -c ./blueberry.c
wasm-ld -m wasm32 --no-entry --export-all --allow-undefined -o blueberry.wasm blueberry.o 