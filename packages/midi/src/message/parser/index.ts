import { MIDIJsError } from '@philipyun-midi/midi/common/error';
import { normalizeUInt7 } from '../utils';
import { UInt7 } from '../utils/ranges';
import {
  ChannelModeMessage,
  ChannelModeType,
  ChannelVoiceMessage,
  MIDIMessagePrefixMap,
  RawMidiMessage,
} from '../utils/types';
import {
  data1ByteIsChannelModeController,
  validateChannelVoicePrefix,
  validateChannelWord,
  validateData1Byte,
  validateData2Byte,
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

const parseChannelModeMessageType = (data1Byte: UInt7): ChannelModeType => {
  if (data1Byte >= 120 && data1Byte <= 127) {
    switch (data1Byte) {
      case 120:
        return 'all-sound-off';
      case 121:
        return 'reset-all-controllers';
      case 122:
        return 'local-control';
      case 123:
      case 124:
      case 125:
      case 126:
      case 127:
        return 'all-notes-off';
      default:
        throw new MIDIJsError('parseChannelModeMessageType', 'This technically should have never happened...');
    }
  }
  throw new MIDIJsError('parseChannelModeMessageType', 'The data1 byte is not a valid channel mode message controller');
};

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
    if (data1ByteIsChannelModeController(data1Byte)) {
      const channelModeData2Byte = validateData2Byte(rawMIDIMessage);
      return {
        channel,
        category: 'channel-mode',
        data1: data1Byte,
        data2: channelModeData2Byte,
        type: parseChannelModeMessageType(data1Byte),
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
