import { Flex, Text } from "@radix-ui/themes";
import { styled } from "@stitches/react";
import { Dispatch, SetStateAction } from "react";

const NEURON_SIZE = 42;

const Neuron = styled(Flex, {
  borderRadius: "100%",
  borderColor: "#000",
  borderWidth: 1,
  borderStyle: "solid",
  width: NEURON_SIZE,
  height: NEURON_SIZE,
  backgroundColor: "#fff",

  alignItems: "center",
  justifyContent: "center",
});

const PressableNeuron = styled(Neuron, {
  cursor: "pointer",
});

type NetworkProps = {
  input: number[];
  hidden: number[][];
  output: number[];
  setInputLayer: Dispatch<SetStateAction<number[]>>;
};

export const Network = ({
  input,
  hidden,
  output,
  setInputLayer,
}: NetworkProps) => {
  return (
    <Flex align="center" gap="4">
      <Flex direction="column" gap="4">
        {input.map((value, index) => (
          <Flex height={`${NEURON_SIZE}px`} align="center">
            <Text weight="medium">{`${String.fromCharCode(
              65 + index
            )} (${value})`}</Text>
          </Flex>
        ))}
      </Flex>

      <Flex direction="column" gap="4">
        {input.map((value, index) => (
          <PressableNeuron
            onClick={() => {
              const inputCopy = [...input];
              inputCopy[index] = (input[index] + 1) % 2;
              setInputLayer(inputCopy);
            }}
          >
            {value}
          </PressableNeuron>
        ))}
      </Flex>

      {hidden.map((layer) => (
        <Flex direction="column" gap="4">
          {layer.map((value) => (
            <Neuron>{value}</Neuron>
          ))}
        </Flex>
      ))}

      <Flex direction="column" gap="4">
        {output.map((value) => (
          <Neuron>{value}</Neuron>
        ))}
      </Flex>

      {output.map((value) => (
        <Flex height={`${NEURON_SIZE}px`} align="center">
          <Text weight="medium">{`out (${value})`}</Text>
        </Flex>
      ))}
    </Flex>
  );
};
