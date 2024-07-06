import { ChannelVoiceMessage, MIDIMessageTypeMap } from '../utils/types';
import { normalizeChannel, normalizeUInt8 } from '../utils';
import { RawMidiMessage } from '../utils/types';

/**
 * Serializes a RawMidiMessage type into a Uint8Array
 * @param message
 * @returns serialized MIDI Message in Uint8Array format
 */
const serializeRawMIDIMessage = (message: RawMidiMessage): Uint8Array => {
  const dataArray = [normalizeUInt8(message.status), message.data1 ?? null, message.data2 ?? null];
  const filteredArray = dataArray.filter(item => item !== null);

  return new Uint8Array(filteredArray);
};

export const serializeChannelVoiceMessage = (message: ChannelVoiceMessage): Uint8Array => {
  const prefixByte = MIDIMessageTypeMap[message.type] << 4;
  const channelByte = normalizeChannel(message.channel);
  const statusByte = prefixByte | channelByte;

  return serializeRawMIDIMessage({
    status: statusByte,
    data1: message.data1,
    data2: message.data2,
  });
};
