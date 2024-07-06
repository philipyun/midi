import { MIDIJsError } from '../../common/error';
import { normalizeByte } from '../common';
import { RawMidiMessage } from '../common/types';

/**
 * parses and converts a Uint8Array formatted MIDI message into a RawMidiMessage
 * @param message - Uint8Array received from midi input
 * @returns - RawMidiMessage format
 */
export const parseRawMIDIMessage = (message: Uint8Array): RawMidiMessage => {
  if (message[0] === undefined) {
    throw new MIDIJsError('parseRawMIDIMessage', 'bad message input');
  }

  return {
    status: message[0],
    data1: message[1],
    data2: message[2],
  };
};

/**
 * Serializes a RawMidiMessage type into a Uint8Array
 * @param message
 * @returns serialized MIDI Message in Uint8Array format
 */
export const serializeRawMIDIMessage = (message: RawMidiMessage): Uint8Array => {
  const dataArray = [
    normalizeByte(message.status),
    message.data1 ? normalizeByte(message.data1) : null,
    message.data2 ? normalizeByte(message.data2) : null,
  ].filter(item => item !== null);

  return new Uint8Array(dataArray);
};
