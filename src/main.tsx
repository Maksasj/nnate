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

import { BlueberryInstance, Pointer, assert, bluebInit, bluebMapFloat32Array, blueberryInstance, concatenateArrays, make_environment, rand } from "blueb.js";
import { PeachMatrix } from "blueb.js/dist/peach.map";
import { internalPeachGetMatrixCols, internalPeachGetMatrixRows, internalPeachGetMatrixValues, internalPeachNewMatrix } from "blueb.js/dist/peach.h";

export const BlueberryContext = createContext<BlueberryInstance | null>(null);

export function peachMapMatrix(matrixPtr: Pointer) : PeachMatrix | null {
  console.log("Mapping a matrix");
  if(blueberryInstance === null) {
    console.log("Isntance is null");

    return null;
  }

  console.log(matrixPtr);
  if(matrixPtr === null)
      return null;

  const rows = internalPeachGetMatrixRows(matrixPtr);
  const cols = internalPeachGetMatrixCols(matrixPtr);
  const valuePtr = internalPeachGetMatrixValues(matrixPtr);

  console.log(rows);
  console.log(cols);
  console.log(valuePtr);

  if(valuePtr === null)
      return null;

  const value = bluebMapFloat32Array(valuePtr, rows * cols);

  if(value === null)
      return null;

  return {
      rows: rows, 
      cols: cols, 
      value: value,
      pointer: matrixPtr
  };
}

export function paechNewMatrix(matrix: number[][]): PeachMatrix | null {
  const rows = matrix[0].length;
  const cols = matrix.length;

  const ptr = internalPeachNewMatrix(rows, cols);
  if(ptr === null)
      return null;

  console.log(ptr);

  const map = peachMapMatrix(ptr);

  if(map === null)
      return null;

  map.value.set(concatenateArrays<number>(matrix));
  
  return map;
}

const WasmContextProvider = (props: PropsWithChildren) => {
  const [instance, setInstance] = useState<BlueberryInstance | null>(null);
  const isMounted = useRef<boolean>(false);
  
  useEffect(() => {
    if(isMounted.current)
      return;

    isMounted.current = true;

    bluebInit().then((blueb) => {
      console.log(blueb);
      console.log(blueberryInstance);

      setInstance(blueb);

      const inputs = paechNewMatrix([
        [0.0, 0.0],
        [0.0, 1.0],
        [1.0, 0.0],
        [1.0, 1.0]
      ]);

      // console.log(inputs);
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
