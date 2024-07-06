import { MIDIJsError } from '../../common/error';
import { UInt7 } from '../utils/ranges';
import {
  ChannelVoiceMessage,
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

const channelIsMidiChannel = (channel: number): channel is MIDIChannel => channel >= 0 && channel <= 15;

export const validateChannelWord = (channel: number): MIDIChannel => {
  if (channelIsMidiChannel(channel)) {
    return channel;
  }
  throw new MIDIJsError('validateChannelWord', 'midi channel is not valid -- but this should have never happened');
};

const prefixIsChannelVoice = (prefix: number): prefix is ChannelVoicePrefix => prefix >= 0b1000 && prefix <= 0b1110;

export const validateChannelVoicePrefix = (prefix: number): ChannelVoicePrefix => {
  if (prefixIsChannelVoice(prefix)) {
    return prefix;
  }
  throw new MIDIJsError('parseRawChannelVoiceMessage', 'message is not a channel voice message');
};
