import { MIDIJsError } from '../../common/error';
import { UInt7 } from '../utils/ranges';
import {
  ChannelModeController,
  ChannelVoicePrefix,
  MIDIChannel,
  MIDIMessagePrefix,
  RawMidiMessage,
} from '../utils/types';

const midiPrefixIsValid = (prefix: number): prefix is MIDIMessagePrefix => prefix >= 0b1000 && prefix <= 0b1111;

export const validateMIDIPrefix = (prefix: number): MIDIMessagePrefix => {
  if (midiPrefixIsValid(prefix)) {
    return prefix;
  }
  throw new MIDIJsError('validateMIDIPrefix', 'MIDI message does not contain a valid status byte');
};

const prefixIsChannelVoice = (prefix: number): prefix is ChannelVoicePrefix => prefix >= 0b1000 && prefix <= 0b1110;

export const validateChannelVoicePrefix = (prefix: number): ChannelVoicePrefix => {
  if (prefixIsChannelVoice(prefix)) {
    return prefix;
  }
  throw new MIDIJsError('parseRawChannelVoiceMessage', 'message is not a channel voice message');
};

export const validateStatusByte = (message: Uint8Array): number => {
  const statusByte = message[0];
  if (statusByte !== undefined) {
    return statusByte;
  }
  throw new MIDIJsError('validateStatusByte', 'bad input message, no status byte');
};

export const validateData1Byte = (rawMessage: RawMidiMessage): UInt7 => {
  if (rawMessage.data1 !== undefined) {
    return rawMessage.data1;
  }
  throw new MIDIJsError('validateData1Byte', 'bad input message, no Data1 byte');
};

export const validateData2Byte = (rawMessage: RawMidiMessage): UInt7 => {
  if (rawMessage.data2 !== undefined) {
    return rawMessage.data2;
  }
  throw new MIDIJsError('validateData2Byte', 'bad input message, no Data2 byte');
};

const channelIsMidiChannel = (channel: number): channel is MIDIChannel => channel >= 0 && channel <= 15;

export const validateChannelWord = (channel: number): MIDIChannel => {
  if (channelIsMidiChannel(channel)) {
    return channel;
  }
  throw new MIDIJsError('validateChannelWord', 'midi channel is not valid -- but this should have never happened');
};

export const data1ByteIsChannelModeController = (data1Byte: UInt7): data1Byte is ChannelModeController =>
  data1Byte >= 120 && data1Byte <= 127;
