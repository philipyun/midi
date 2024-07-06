import { BaseMidiMessage } from '../common/types';

export const ChannelVoicePrefixMap = {
  0b1000: 'note-off',
  0b1001: 'note-on',
  0b1010: 'polyphonic-key-pressure',
  0b1011: 'control-change',
  0b1100: 'program-change',
  0b1101: 'channel-pressure',
  0b1110: 'pitch-bend',
} as const;

export const ChannelVoiceTypeMap = {
  'note-off': 0b1000,
  'note-on': 0b1001,
  'polyphonic-key-pressure': 0b1010,
  'control-change': 0b1011,
  'program-change': 0b1100,
  'channel-pressure': 0b1101,
  'pitch-bend': 0b1110,
} as const;

export type ChannelVoicePrefix = keyof typeof ChannelVoicePrefixMap;
export type ChannelVoiceType = (typeof ChannelVoicePrefixMap)[ChannelVoicePrefix];

export type MIDIChannel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export interface ChannelVoiceMessage extends BaseMidiMessage<'channel-voice'> {
  channel: MIDIChannel;
  type: ChannelVoiceType;
}
