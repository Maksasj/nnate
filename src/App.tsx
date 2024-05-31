import { Flex, Button } from '@radix-ui/themes';
import { useContext } from 'react';
import { WasmContext } from './main';

function App() {
  const context = useContext(WasmContext);

  if (context === null) {
    return <p>Loading !</p>
  } else {
    return (
      <Flex>
        <Button onClick={() => {
          const heap = new Uint8Array((context.exports.memory as any).buffer, 0, 4096);
          console.log(heap);
        }}>Hello</Button>
      </Flex>
    )
  }

}

export default App
