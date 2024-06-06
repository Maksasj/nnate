import { Flex, Button } from '@radix-ui/themes';
import { useContext } from 'react';
import { BlueberryContext } from './main';
import { blueberryInstance } from 'blueb.js';

function App() {
  const context = useContext(BlueberryContext);

  if (context === null) {
    return <p>Loading !</p>
  } else {
    return (
      <Flex>
        <Button onClick={() => {
          console.log(blueberryInstance);
          // const heap = new Uint8Array((context.exports.memory as any).buffer, 0, 4096);
          // console.log(heap);
        }}>Hello</Button>
      </Flex>
    )
  }

}

export default App
