import { Flex, Text } from "@radix-ui/themes";
import { Fragment, useState } from "react";
import { styled } from "@stitches/react";
import { Chart } from "react-google-charts";

import AndGateSvg from "../assets/AND_gate.svg?react";
import AndTruthTableSvg from "../assets/AND_truth_table.svg?react";
import { GateType } from "./GateType";

const Description = ({ type }: { type: GateType }) => {
  return (
    <Flex direction="column" align="center" gap="2">
      <Text size="4" weight="regular">
        Logical "{type.toString()}" gate
      </Text>
      {type === GateType.AND && (
        <Fragment>
          <AndGateSvg />
          <AndTruthTableSvg />
        </Fragment>
      )}
    </Flex>
  );
};

type NeuronProps = {
  value: number; // value should be in interval [0, 1]
};

const _Neuron = styled(Flex, {
  borderRadius: "100%",
  borderColor: "#000",
  borderWidth: 1,
  borderStyle: "solid",
  width: 42,
  height: 42,
  backgroundColor: "#fff",

  alignItems: "center",
  justifyContent: "center",
});

const Neuron = ({ value }: { value: number }) => {
  return <_Neuron>{value}</_Neuron>;
};

type NetworkProps = {
  layers: number[][];
  setInputLayer: (inputs: number[]) => void;
};

const Network = ({ layers, setInputLayer }: NetworkProps) => {
  return (
    <Flex align="center" gap="4">
      {layers.map((layer) => {
        return (
          <Flex direction="column" gap="4">
            {layer.map((value) => (
              <Neuron value={value} />
            ))}
          </Flex>
        );
      })}
    </Flex>
  );
};

const SingleArgumentNetwork = () => {
  const [inputLayer, setInputLayer] = useState([0]);
  const [outputLayer, setOutputLayer] = useState([0]);

  return (
    <Network layers={[inputLayer, outputLayer]} setInputLayer={setInputLayer} />
  );
};

const DoubleArgumentNetwork = () => {
  const [inputLayer, setInputLayer] = useState([0, 0]);
  const [outputLayer, setOutputLayer] = useState([0]);

  return (
    <Network layers={[inputLayer, outputLayer]} setInputLayer={setInputLayer} />
  );
};

const NeuralNetwork = ({ type }: { type: GateType }) => {
  if (type === GateType.IDENTITY || type === GateType.NOT) {
    return <SingleArgumentNetwork />;
  }

  return <DoubleArgumentNetwork />;
};

export type GateSimulationProps = {
  type: GateType;
};

const initialData = [
  ["Time", "Value"],
  [0, 100],
];

const options = {
  title: "Cost function",
  curveType: "function",
  legend: { position: "bottom" },
};

export const GateSimulation = ({ type }: GateSimulationProps) => {
  const [data, setData] = useState(initialData);
  return (
    <Flex>
      <Description type={type} />
      <NeuralNetwork type={type} />
      <Flex direction="column">
        <Chart
          chartType="LineChart"
          width="800px"
          height="400px"
          data={data}
          options={options}
        />
        <button
          onClick={() => {
            setData((old) => {
              old.push([
                (old[old.length - 1][0] as number) + 1,
                (old[old.length - 1][1] as number) +
                  10 * (Math.random() > 0.5 ? 1 : -1),
              ]);
              return [...old];
            });
          }}
        >
          test
        </button>
      </Flex>
    </Flex>
  );
};
