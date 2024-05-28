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

function rand() {
    return Math.floor(Math.random() * 65535);
}

WebAssembly.instantiateStreaming(fetch('./wasm.wasm'), {
    env: make_environment({
        "rand": rand,
        "powf": Math.pow
    })
}).then(w0 => {
    w = w0;
    console.log(w);

    const model = w.instance.exports.create_model();

    console.log(w.instance.exports.train(model));
    console.log(w.instance.exports.train(model));
    console.log(w.instance.exports.train(model));
    console.log(w.instance.exports.train(model));
    console.log(w.instance.exports.train(model));
    console.log(w.instance.exports.train(model));
});


