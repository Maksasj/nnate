console.log("Hello world !");

// Function from https://github.com/tsoding/olive.c/blob/master/js/vc.js
function make_environment(...envs) {
    return new Proxy(envs, {
        get(target, prop, receiver) {
            for (let env of envs) {
                if (env.hasOwnProperty(prop)) {
                    return env[prop];
                }
            }
            return (...args) => {console.error("NOT IMPLEMENTED: "+prop, args)}
        }
    });
}

WebAssembly.instantiateStreaming(fetch('./wasm.wasm'), {
    "env": make_environment()
}).then(w0 => {
    w = w0;
    console.log(w);

    let val = w.instance.exports.run();
    console.log(val);
})