import { normalizeUInt8 } from '../utils';
import { RawMidiMessage } from '../utils/types';

/**
 * Serializes a RawMidiMessage type into a Uint8Array
 * @param message
 * @returns serialized MIDI Message in Uint8Array format
 */
export const serializeRawMIDIMessage = (message: RawMidiMessage): Uint8Array => {
  const dataArray = [normalizeUInt8(message.status), message.data1 ?? null, message.data2 ?? null];
  const filteredArray = dataArray.filter(item => item !== null);

  return new Uint8Array(filteredArray);
};
