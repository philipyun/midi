export const requestMIDIAccess = async () => {
  const access = await navigator.requestMIDIAccess();
  const inputs = Array.from(access.inputs.values());
  const outputs = Array.from(access.outputs.values());

  return {
    inputs,
    outputs,
  };
};

export type AvailableMIDIPorts =  Awaited<ReturnType<typeof requestMIDIAccess>>;
