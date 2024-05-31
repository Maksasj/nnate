// Function from https://github.com/tsoding/olive.c/blob/master/js/vc.js
export function make_environment(...envs: any[]) {
    return new Proxy(envs, {
        get(_, prop) {
            for (let env of envs) {
                if (env.hasOwnProperty(prop)) {
                    return env[prop];
                }
            }
            return (...args: any[]) => { console.error("NOT IMPLEMENTED: " + (prop as string), args) }
        }
    });
}

export function rand() {
    return Math.floor(Math.random() * 65535);
}

export function assert(exp: any) {
    if (exp === 0)
        console.error("WASM assertion failed");
}