// Function from https://github.com/tsoding/olive.c/blob/master/js/vc.js
function make_environment(...envs) {
    return new Proxy(envs, {
        get(target, prop, receiver) {
            for (let env of envs) {
                if (env.hasOwnProperty(prop)) {
                    return env[prop];
                }
            }
            return (...args) => { console.error("NOT IMPLEMENTED: " + prop, args) }
        }
    });
}

function rand() {
    return Math.floor(Math.random() * 65535);
}

function assert(exp) {
    if (exp === 0)
        console.error("WASM assertion failed");
}

const i32size = 4;
const floatSize = 4;
const u8size = 1;

function nnate_create_int32_array(w, list) {
    const ex = w.instance.exports;
    const memory = ex.memory;

    const length = list.length;

    const ptr = ex.lemon_malloc_i32(i32size * length);

    const array = new Int32Array(memory.buffer, ptr, length);
    array.set(list);

    return ptr;
}

function nnate_create_float_array(w, list) {
    const ex = w.instance.exports;
    const memory = ex.memory;

    const length = list.length;

    const ptr = ex.lemon_malloc_i32(floatSize * length);
    const array = new Float32Array(memory.buffer, ptr, length);
    array.set(list);

    return ptr;
}

function nnate_create_peach_matrix(w, matrix) {
    const ex = w.instance.exports;
    const memory = ex.memory;
}

async function main() {
    const w = await WebAssembly.instantiateStreaming(fetch('./wasm.wasm'), {
        env: make_environment({
            "rand": rand,
            "powf": Math.pow,
            "assert": assert
        })
    })

    console.log(w);

    const ex = w.instance.exports;
    const memory = ex.memory;

    // Initializing heap
    const heap = new Uint8Array(memory.buffer, ex.__heap_base, 4096);
    ex.lemon_init_i32(heap.byteOffset, 4096);

    const itmp = nnate_create_float_array(w, [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ]);

    const inputs = ex.paech_new_matrix(4, 2);
    ex.peach_matrix_fill_values(inputs, itmp);

    const otmp = nnate_create_float_array(w, [
        0.0,
        0.0,
        0.0,
        1.0
    ]);

    const outputs = ex.paech_new_matrix(4, 1);
    ex.peach_matrix_fill_values(outputs, otmp);

    // Create model
    const arch = nnate_create_int32_array(w, [2, 2, 1]);
    let model = ex.blueb_new_model(arch, 3);
    ex.blueb_rand_model(model, -1.0, 1.0);

    for(let i = 0; i < 10000; ++i) {
        ex.blueb_train_gradient_descent(model, inputs, outputs, 4, 1, 0.05)
        console.log(ex.blueb_mse_cost(model, inputs, outputs, 4));
    }
}

main().then(() => console.log('Main finished'))
