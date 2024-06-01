import React, { PropsWithChildren, createContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme } from '@radix-ui/themes';
import './index.css'

import '@radix-ui/themes/styles.css';

import { BlueberryInstance, blueberryInstance } from './blueberry.ts';

export const BlueberryContext = createContext<BlueberryInstance | null>(null);

const WasmContextProvider = (props: PropsWithChildren) => {
  const [instance, setInstance] = useState<BlueberryInstance | null>(null);

  // How to do that ?
  useEffect(() => {
    setTimeout(() => {
      setInstance(blueberryInstance);
    }, 1000);
  })

  return <BlueberryContext.Provider value={instance}>{props.children}</BlueberryContext.Provider>;
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