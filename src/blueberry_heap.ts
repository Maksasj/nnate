import { BlueberryInstance } from "./blueberry";

const heapSize: number = 4096;

// Initializing heap
export function initializeHeap(instance: BlueberryInstance) {
    if (instance === null)
        return;

    const ex = instance.wasm.exports;
    const memory = ex.memory as any;

    const heap = new Uint8Array(memory.buffer as any, ex.__heap_base as any, heapSize);
    (ex.lemon_init_i32 as Function)(heap.byteOffset, heapSize);
}
