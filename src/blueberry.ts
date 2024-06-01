import init from './blueberry.wasm?init'
import { initializeHeap } from './blueberry_heap';

import { BlueberryAllocation, BlueberryAllocationEnum, Matrix, Pointer, bluebCreateInt32Array, bluebMapMatrix, bluebMapModel } from './blueberry_memory';
import { make_environment, rand, assert, } from './blueberry_utils'

export type BlueberryInstance = {
    wasm: WebAssembly.Instance;

    // Lets track all allocations, if we ever need to clear
    allocations: BlueberryAllocation[];
};

export let blueberryInstance: BlueberryInstance | null = null;

async function initBlueberry() {
    const env = make_environment({
        "rand": rand,
        "powf": Math.pow,
        "assert": assert
    }) as any;

    init({
        env: env
    }).then((w) => {
        if (blueberryInstance !== null)
            return;

        blueberryInstance = {
            wasm: w,
            allocations: []
        };

        initializeHeap(blueberryInstance);

        const inputs = bluebCreateMatrix([
            [0.0, 0.0],
            [0.0, 1.0],
            [1.0, 0.0],
            [1.0, 1.0]
        ]);

        const outputs = bluebCreateMatrix([
            [0.0],
            [0.0],
            [0.0],
            [1.0]
        ]);

        // Create model
        let model = bluebCreateModel([2, 2, 1]);

        // Train network and print result
        for (let i = 0; i < 100; ++i) {
            bluebTrainGradientDescent(model, inputs, outputs, 4, 1, 0.05);

            const cost = bluebMseCost(model, inputs, outputs, 4);
            console.log(cost);
        }

        console.log(bluebMapModel(model));

        // console.log();
    })
}

initBlueberry();

export function bluebCreateMatrix(matrix: Matrix): Pointer {
    if (blueberryInstance === null)
        return null;

    let arr: number[] = [];
    for (var row of matrix)
        arr = arr.concat(row);

    const ex = blueberryInstance.wasm.exports;

    const matrixPtr = (ex.paech_new_matrix as Function)(matrix[0].length, matrix.length);
    blueberryInstance.allocations.push({
        ptr: matrixPtr,
        kind: BlueberryAllocationEnum.Matrix
    });

    let mapped = bluebMapMatrix(matrixPtr);

    if(mapped == null)
        return null;

    mapped.value.set(arr);

    return matrixPtr;
}

export function bluebCreateModel(arr: number[]): Pointer {
    if (blueberryInstance === null)
        return null;

    const ex = blueberryInstance.wasm.exports;
    const arch = bluebCreateInt32Array(arr);
    let model = (ex.blueb_new_model as Function)(arch, arr.length);
    (ex.blueb_rand_model as Function)(model, -1.0, 1.0);
    // (ex.lemon_free as Function)(arch); // Todo fix this

    blueberryInstance.allocations.push({
        ptr: model,
        kind: BlueberryAllocationEnum.Model
    });

    return model;
}

export function bluebTrainGradientDescent(model: Pointer, inputs: Pointer, outputs: Pointer, sampleCount: number, epoch: number, learningRate: number) {
    if (blueberryInstance === null)
        return;

    const ex = blueberryInstance.wasm.exports;
    (ex.blueb_train_gradient_descent as Function)(model, inputs, outputs, sampleCount, epoch, learningRate);
}

export function bluebMseCost(model: Pointer, inputs: Pointer, outputs: Pointer, sampleCount: number): number {
    if (blueberryInstance === null)
        return 0.0;

    const ex = blueberryInstance.wasm.exports;
    return (ex.blueb_mse_cost as Function)(model, inputs, outputs, sampleCount);
}
