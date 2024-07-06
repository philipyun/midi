import { parseRawChannelVoiceMessage } from '../channel/voice';
import { MIDIMessagePrefixMap } from '../utils/types';
import { parseRawMIDIMessage } from './raw-message';
import { validateData1Byte, validateMIDIPrefix, validateStatusByte } from './validate';

const parseSystemMessage = (rawMessage: Uint8Array) => {};

const parseChannelMessage = (rawMessage: Uint8Array) => {
  const rawMIDIMessage = parseRawMIDIMessage(rawMessage);
  const midiPrefix = validateMIDIPrefix(rawMIDIMessage.status);
  const midiMessageType = MIDIMessagePrefixMap[midiPrefix];

  // every channel voice/mode message has to have a data 1 byte
  const data1Byte = validateData1Byte(rawMIDIMessage);
  // check if its a CC Message Prefix, since control change messages can be channel mode
  if (midiMessageType === 'control-change') {
    // now check if data1 is between 120-127, if we are, we're a channel mode message
    if (data1Byte >= 120 && data1Byte <= 127) {
      // return parseChannelModeMessage
    }
  }
  return parseRawChannelVoiceMessage(rawMIDIMessage);
};

export const parseMIDIMessage = (rawMessage: Uint8Array) => {
  const statusByte = validateStatusByte(rawMessage);
  const midiPrefix = validateMIDIPrefix(statusByte);
  const midiMessageType = MIDIMessagePrefixMap[midiPrefix];
  if (midiMessageType === 'system') {
    return parseSystemMessage(rawMessage);
  }
  return parseChannelMessage(rawMessage);
};
