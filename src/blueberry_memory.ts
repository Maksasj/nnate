import { blueberryInstance } from "./blueberry";

const u32size: number = 4;
const floatSize: number = 4;

export type Pointer = number | null;
export type Matrix = number[][];

export enum BlueberryAllocationEnum {
    Matrix,
    Model,
    Array
};

export type BlueberryAllocation = {
    ptr: Pointer;
    kind: BlueberryAllocationEnum;
};

export type PeachMatrixMapped = {
    rows: number;
    cols: number;

    value: Float32Array;
}

export type BlueberryModelMapped = {
    weights: PeachMatrixMapped[];
    biases: PeachMatrixMapped[];
    neurons: PeachMatrixMapped[];

    count: number;
};

export function bluebCreateInt32Array(list: number[]): Pointer {
    if (blueberryInstance === null)
        return null;

    const ex = blueberryInstance.wasm.exports;
    const memory = ex.memory as any;

    const ptr = (ex.lemon_malloc_i32 as Function)(u32size * list.length);
    const array = new Int32Array(memory.buffer, ptr, list.length);
    array.set(list);

    blueberryInstance.allocations.push({
        ptr: ptr,
        kind: BlueberryAllocationEnum.Array
    });

    return ptr;
}

export function bluebCreateFloatArray(list: number[]): Pointer {
    if (blueberryInstance === null)
        return null;

    const ex = blueberryInstance.wasm.exports;
    const memory = ex.memory as any;

    const ptr = (ex.lemon_malloc_i32 as Function)(floatSize * list.length);
    const array = new Float32Array(memory.buffer, ptr, list.length);
    array.set(list);

    blueberryInstance.allocations.push({
        ptr: ptr,
        kind: BlueberryAllocationEnum.Array
    });

    return ptr;
}

export function bluebMapMatrix(matrixPtr: Pointer) : PeachMatrixMapped | null {
    if(blueberryInstance == null)
        return null;

    if(matrixPtr == null)
        return null;

    const ex = blueberryInstance.wasm.exports;
    const memory = ex.memory as any;

    const rows = (ex.peach_get_matrix_rows as Function)(matrixPtr);
    const cols = (ex.peach_get_matrix_cols as Function)(matrixPtr);

    const valuePtr = (ex.peach_get_matrix_values as Function)(matrixPtr);
    const value = new Float32Array(memory.buffer as any, valuePtr, rows * cols);

    let matrix: PeachMatrixMapped = {
        rows: rows, 
        cols: cols, 
        value: value
    };

    return matrix;
}

export function bluebMapModel(modelPtr: Pointer) : BlueberryModelMapped | null {
    if(blueberryInstance == null)
        return null;

    if(modelPtr == null)
        return null;

    const ex = blueberryInstance.wasm.exports;

    let model: BlueberryModelMapped = {
        weights: [],
        biases: [],
        neurons: [],
        count: (ex.blueb_get_model_layer_count as Function)(modelPtr)
    };  
    
    if(model.count <= 0)
        return null;

    for(let i = 0; i < model.count; ++i) {
        if(i > 0) {
            let weights = bluebMapMatrix((ex.blueb_get_model_weight_layer as Function)(modelPtr, i - 1));
            if(weights != null)
                model.weights.push(weights);

            let biases = bluebMapMatrix((ex.blueb_get_model_biases_layer as Function)(modelPtr, i - 1));
            if(biases != null)
                model.biases.push(biases);
        }
        
        let neurons = bluebMapMatrix((ex.blueb_get_model_neuron_layer as Function)(modelPtr, i));
        if(neurons != null)
            model.neurons.push(neurons);
    }

    return model;
}