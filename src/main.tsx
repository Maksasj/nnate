import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import "./index.css";

import "@radix-ui/themes/styles.css";

import { BlueberryInstance, bluebInit } from "blueb.js";

export const BlueberryContext = createContext<BlueberryInstance | null>(null);

const WasmContextProvider = (props: PropsWithChildren) => {
  const [instance, setInstance] = useState<BlueberryInstance | null>(null);
  const isMounted = useRef<boolean>(false);
  
  useEffect(() => {
    if(isMounted.current)
      return;

    isMounted.current = true;

    bluebInit().then((blueb) => {
      console.log(blueb);
      setInstance(blueb);
    });
  }, []);

  return (
    <BlueberryContext.Provider value={instance}>
      {props.children}
    </BlueberryContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <WasmContextProvider>
        <App />
      </WasmContextProvider>
    </Theme>
  </React.StrictMode>
);
