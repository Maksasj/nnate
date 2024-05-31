import React, { PropsWithChildren, createContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme } from '@radix-ui/themes';
import './index.css'

import '@radix-ui/themes/styles.css';

import init from './wasm.wasm?init'
import { make_environment, rand, assert } from './wasm.ts';

/*
type WasmContextType = {
  i: WebAssembly.Instance
};
*/

export const WasmContext = createContext<WebAssembly.Instance | null>(null);

const WasmContextProvider = (props: PropsWithChildren) => {
  const [instance, setInstance] = useState<WebAssembly.Instance | null>(null);

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
      setTimeout(() => {
        setInstance(w);
      }, 5000);

      console.log();

      const ex = w.exports;
      const memory = ex.memory;

      // Initializing heap
      const heap = new Uint8Array((memory as any).buffer, 0, 4096);
      console.log(heap);

      // ex.lemon_init_i32(heap.byteOffset, 4096);

      // console.log(heap);
      // console.log(ex.lemon_malloc_i32(4));

      // console.log(heap);
      // console.log(ex.lemon_malloc_i32(4));
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
