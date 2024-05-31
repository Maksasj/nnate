import React, { PropsWithChildren, createContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme } from '@radix-ui/themes';
import './index.css'

import '@radix-ui/themes/styles.css';

import init from './blueberry.wasm?init'
import { blueb_create_matrix, blueb_create_model } from './blueberry.ts';

/*
type WasmContextType = {
  i: WebAssembly.Instance
};
*/

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

export const WasmContext = createContext<WebAssembly.Instance | null>(null);

const WasmContextProvider = (props: PropsWithChildren) => {
  const [instance, _] = useState<WebAssembly.Instance | null>(null);

  useEffect(() => {
    if (instance !== null)
      return;

    init({
      env: make_environment({
        "rand": rand,
        "powf": Math.pow,
        "assert": assert
      }) as any
    }).then((w) => {
      console.log(w);

      const ex = w.exports;
      const memory = ex.memory;

      // Initializing heap
      const heap = new Uint8Array((memory as any).buffer as any, ex.__heap_base as any, 4096);
      (ex.lemon_init_i32 as Function)(heap.byteOffset, 4096);

      const inputs = blueb_create_matrix(w, [
        [0.0, 0.0],
        [0.0, 1.0],
        [1.0, 0.0],
        [1.0, 1.0]
      ]);

      const outputs = blueb_create_matrix(w, [
        [0.0],
        [0.0],
        [0.0],
        [1.0]
      ]);

      // Create model
      let model = blueb_create_model(w, [2, 2, 1]);

      for (let i = 0; i < 1000; ++i) {
        (ex.blueb_train_gradient_descent as Function)(model, inputs, outputs, 4, 1, 0.05)
        console.log((ex.blueb_mse_cost as Function)(model, inputs, outputs, 4));
      }
    })
  }, []);

  return <WasmContext.Provider value={instance}>{props.children}</WasmContext.Provider>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme>
      <WasmContextProvider>
        <App />
      </ WasmContextProvider>
    </Theme>
  </React.StrictMode>,
)