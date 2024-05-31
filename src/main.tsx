import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme } from '@radix-ui/themes';
import './index.css'

import '@radix-ui/themes/styles.css';

import init from './wasm.wasm?init'
import { make_environment, rand, assert } from './wasm.ts';

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
  const heap = new Uint8Array((memory as any).buffer, 0, 4096);
  console.log(heap);

  // ex.lemon_init_i32(heap.byteOffset, 4096);

  // console.log(heap);
  // console.log(ex.lemon_malloc_i32(4));

  // console.log(heap);
  // console.log(ex.lemon_malloc_i32(4));
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>,
)
