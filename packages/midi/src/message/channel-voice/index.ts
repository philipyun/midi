import { MIDIJsError } from '../../common/error';
import { normalizeChannel } from '../common';
import { RawMidiMessage } from '../types';
import { serializeRawMIDIMessage } from '../parser/raw-message';
import {
  ChannelVoiceMessage,
  MIDIMessagePrefix,
  MIDIMessagePrefixMap,
  MIDIMessageTypeMap,
  MIDIChannel,
} from '../types';

const prefixIsChannelVoice = (prefix: number): prefix is MIDIMessagePrefix => {
  return prefix >= 0b1000 && prefix <= 0b1110;
};

const channelIsMidiChannel = (channel: number): channel is MIDIChannel => {
  return channel >= 1 && channel <= 16;
};

export const parseRawChannelVoiceMessage = (message: RawMidiMessage): ChannelVoiceMessage => {
  const statusPrefix = message.status >> 4;

  if (!prefixIsChannelVoice(statusPrefix)) {
    throw new MIDIJsError('parseRawChannelVoiceMessage', 'message is not a channel voice message');
  }

  const channel = (message.status << 4) >> 4;

  if (!channelIsMidiChannel(channel)) {
    throw new MIDIJsError(
      'parseRawChannelVoiceMessage',
      'midi channel is not valid -- but this should have never happened',
    );
  }

  return {
    category: 'channel-voice',
    type: MIDIMessagePrefixMap[statusPrefix],
    channel,
    data1: message.data1,
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
