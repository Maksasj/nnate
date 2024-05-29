#!/bin/sh

set -xe

clang -Wall -Wextra -Ilemon --target=wasm32 -o wasm.o -c ./wasm.c
wasm-ld -m wasm32 --no-entry --export-all --allow-undefined -o wasm.wasm wasm.o 