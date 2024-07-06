export interface LinkedMIDIPort {
  name: string;
  manufacturer: string;
  input: MIDIInput;
  output: MIDIOutput;
}

export type AvailableMIDIPorts = LinkedMIDIPort[];

export const requestMIDIAccess = async () => {
  const access = await navigator.requestMIDIAccess();
  const inputs = Array.from(access.inputs.values());
  const outputs = Array.from(access.outputs.values());

  return outputs.reduce((acc, output) => {
    const { name, manufacturer } = output;
    const input = inputs.find(i => i.name === output.name && i.manufacturer === output.manufacturer);

    if (input && name !== null && manufacturer !== null) {
      acc.push({
        name,
        manufacturer,
        input,
        output,
      });
    }
    return acc;
  }, [] as AvailableMIDIPorts);
};
