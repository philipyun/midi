import { ChannelVoiceMessage, MIDIMessagePrefixMap, MIDIMessageTypeMap, RawMidiMessage } from '../../utils/types';
import { normalizeChannel } from '../../utils';
import { serializeRawMIDIMessage } from '../../parser/raw-message';
import { validateChannelVoicePrefix, validateChannelWord, validateData1Byte } from '../../parser/validate';

export const parseRawChannelVoiceMessage = (message: RawMidiMessage): ChannelVoiceMessage => {
  const statusPrefix = validateChannelVoicePrefix(message.status >> 4);
  const channel = validateChannelWord((message.status << 4) >> 4);
  const data1 = validateData1Byte(message);

  return {
    channel,
    category: 'channel-voice',
    type: MIDIMessagePrefixMap[statusPrefix],
    data1,
    data2: message.data2,
  };
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
