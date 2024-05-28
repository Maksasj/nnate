import { Flex, Button } from '@radix-ui/themes';

function App() {
  return (
    <Flex>
      <Button onClick={() => {
        console.log('Hello, world!')
      }}>Hello</Button>
    </Flex>
  )
}

export default App
