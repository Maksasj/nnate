import './index.css'

import '@radix-ui/themes/styles.css';

// const u8size: number = 1;
// const u16size: number = 2;
const u32size: number = 4;
// const u64size: number = 8;

const floatSize: number = 4;
// const doubleSize: number = 8;

export function blueb_create_int32_array(instance: WebAssembly.Instance, list: number[]): number {
    const ex = instance.exports;
    const memory = ex.memory;

    const length = list.length;

    const ptr = (ex.lemon_malloc_i32 as Function)(u32size * length);

    const array = new Int32Array((memory as any).buffer, ptr, length);
    array.set(list);

    return ptr;
}

export function blueb_create_float_array(instance: WebAssembly.Instance, list: number[]): number {
    const ex = instance.exports;
    const memory = ex.memory;

    const length = list.length;

    const ptr = (ex.lemon_malloc_i32 as Function)(floatSize * length);
    const array = new Float32Array((memory as any).buffer, ptr, length);
    array.set(list);

    return ptr;
}

type Matrix = number[][];

export function blueb_create_matrix(instance: WebAssembly.Instance, matrix: Matrix): number {
    const ex = instance.exports;

    let arr: number[] = [];

    for (var row of matrix)
        arr = arr.concat(row);

    console.log(arr);

    const itmp = blueb_create_float_array(instance, arr); // Todo clear this
    const inputs = (ex.paech_new_matrix as Function)(matrix[0].length, matrix.length);
    (ex.peach_matrix_fill_values as Function)(inputs, itmp);

    return inputs;
}

type BlueBerryModelArch = number[];

export function blueb_create_model(instance: WebAssembly.Instance, arr: BlueBerryModelArch): number {
    // const ex = instance.exports;
    // 
    // const ar = blueb_create_int32_array(instance, arch);
    // let model = (ex.blueb_new_model as Function)(ar, arch.length);
    // 
    // (ex.blueb_rand_model as Function)(model, -1.0, 1.0);
    // (ex.lemon_free as Function)(ar);
    // 
    // return model;

    const ex = instance.exports;
    const arch = blueb_create_int32_array(instance, arr);
    let model = (ex.blueb_new_model as Function)(arch, arr.length);
    (ex.blueb_rand_model as Function)(model, -1.0, 1.0);
    // (ex.lemon_free as Function)(arch); // Todo fix this

    return model;
}