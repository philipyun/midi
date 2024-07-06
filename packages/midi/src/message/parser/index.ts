import { parseRawChannelVoiceMessage } from '../channel/voice';
import { normalizeUInt7 } from '../utils';
import { ChannelModeMessage, ChannelVoiceMessage, MIDIMessagePrefixMap, RawMidiMessage } from '../utils/types';
import {
  validateChannelVoicePrefix,
  validateChannelWord,
  validateData1Byte,
  validateMIDIPrefix,
  validateStatusByte,
} from './validate';

/**
 * parses and converts a Uint8Array formatted MIDI message into a RawMidiMessage
 * @param message - Uint8Array received from midi input
 * @returns - RawMidiMessage format
 */
const parseRawMIDIMessage = (status: number, data1Byte?: number, data2Byte?: number): RawMidiMessage => {
  const data1 = data1Byte !== undefined ? normalizeUInt7(data1Byte) : undefined;
  const data2 = data2Byte !== undefined ? normalizeUInt7(data2Byte) : undefined;

  return {
    status,
    data1,
    data2,
  };
};

const parseSystemMessage = (rawMessage: Uint8Array) => {};

const parseChannelMessage = (rawMIDIMessage: RawMidiMessage): ChannelVoiceMessage | ChannelModeMessage => {
  const channelVoicePrefix = validateChannelVoicePrefix(rawMIDIMessage.status);
  const channelMessageType = MIDIMessagePrefixMap[channelVoicePrefix];
  const channel = validateChannelWord(rawMIDIMessage.status);

  // every channel voice/mode message has to have a data 1 byte
  const data1Byte = validateData1Byte(rawMIDIMessage);
  const data2Byte = rawMIDIMessage.data2;

  // check if its a CC Message Prefix, since control change messages can be channel mode
  if (channelMessageType === 'control-change') {
    // now check if data1 is between 120-127, if we are, we're a channel mode message
    if (data1Byte >= 120 && data1Byte <= 127) {
      // TODO
      return {
        channel,
        category: 'channel-mode',
        data1: 120,
        data2: 0,
        type: 'all-notes-off',
      };
    }
  }
  return {
    channel,
    category: 'channel-voice',
    type: channelMessageType,
    data1: data1Byte,
    data2: data2Byte,
  };
};

export const parseMIDIMessage = (rawMessage: Uint8Array) => {
  const statusByte = validateStatusByte(rawMessage);
  const midiPrefix = validateMIDIPrefix(statusByte);
  const midiMessageType = MIDIMessagePrefixMap[midiPrefix];
  if (midiMessageType === 'system') {
    return parseSystemMessage(rawMessage);
  }
  const rawMIDIMessage = parseRawMIDIMessage(statusByte, rawMessage[1], rawMessage[2]);
  return parseChannelMessage(rawMIDIMessage);
};
