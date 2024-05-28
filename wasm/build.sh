#!/bin/sh

set -xe

mkdir -p ./bin/

clang -Wall -Wextra -I./ --target=wasm32 -o wasm.o -c ./wasm.c
wasm-ld -m wasm32 --no-entry --export-all --allow-undefined -o wasm.wasm wasm.o