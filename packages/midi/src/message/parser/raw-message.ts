import { normalizeUInt7, normalizeUInt8 } from '../utils';
import { RawMidiMessage } from '../utils/types';
import { validateStatusByte } from './validate';

/**
 * parses and converts a Uint8Array formatted MIDI message into a RawMidiMessage
 * @param message - Uint8Array received from midi input
 * @returns - RawMidiMessage format
 */
export const parseRawMIDIMessage = (message: Uint8Array): RawMidiMessage => {
  const status = validateStatusByte(message);
  const data1 = message[1] !== undefined ? normalizeUInt7(message[1]) : undefined;
  const data2 = message[2] !== undefined ? normalizeUInt7(message[2]) : undefined;

  return {
    status,
    data1,
    data2,
  };
};

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
