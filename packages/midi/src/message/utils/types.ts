import { UInt7 } from './ranges';

export type MIDIMessageCategory = 'channel-voice' | 'channel-mode' | 'system-common' | 'system-real-time';

/**
 * Human readable midi message type
 */
export interface BaseMidiMessage<C extends MIDIMessageCategory> {
  type: string;
  category: C;
  data1?: UInt7;
  data2?: UInt7;
}

/**
 * JSON breakdown of midi message bytes
 */
export interface RawMidiMessage {
  status: number;
  data1?: UInt7;
  data2?: UInt7;
}

export const MIDIMessagePrefixMap = {
  0b1000: 'note-off',
  0b1001: 'note-on',
  0b1010: 'polyphonic-key-pressure',
  0b1011: 'control-change',
  0b1100: 'program-change',
  0b1101: 'channel-pressure',
  0b1110: 'pitch-bend',
  0b1111: 'system',
} as const;

export const MIDIMessageTypeMap = {
  'note-off': 0b1000,
  'note-on': 0b1001,
  'polyphonic-key-pressure': 0b1010,
  'control-change': 0b1011,
  'program-change': 0b1100,
  'channel-pressure': 0b1101,
  'pitch-bend': 0b1110,
  system: 0b1111,
} as const;

export type MIDIMessagePrefix = keyof typeof MIDIMessagePrefixMap;
export type MIDIMessageType = (typeof MIDIMessagePrefixMap)[MIDIMessagePrefix];
export type MIDIChannel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export type ChannelVoicePrefix = Exclude<MIDIMessagePrefix, 0b1111>;
export type ChannelVoiceType =
  | 'note-off'
  | 'note-on'
  | 'polyphonic-key-pressure'
  | 'control-change'
  | 'program-change'
  | 'channel-pressure'
  | 'pitch-bend';

export type ChannelModeController = 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127;

export interface ChannelVoiceMessage extends BaseMidiMessage<'channel-voice'> {
  channel: MIDIChannel;
  type: ChannelVoiceType;
  data1: UInt7;
  data2?: UInt7;
}

export type ChannelModeType = 'all-sound-off' | 'reset-all-controllers' | 'local-control' | 'all-notes-off';

export interface ChannelModeMessage extends BaseMidiMessage<'channel-mode'> {
  channel: MIDIChannel;
  type: ChannelModeType;
  data1: ChannelModeController;
  data2: UInt7;
}

export type MIDIMessage = ChannelVoiceMessage | ChannelModeMessage;
