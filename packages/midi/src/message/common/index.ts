export type MIDIMessageCategory = 'channel-voice' | 'channel-mode' | 'system-common' | 'system-real-time';

/**
 * Human readable midi message type
 */
export interface BaseMidiMessage<C extends MIDIMessageCategory> {
  type: string;
  category: C;
  data1?: number;
  data2?: number;
}

/**
 * JSON breakdown of midi message bytes
 */
export interface RawMidiMessage {
  status: number;
  data1?: number;
  data2?: number;
}
