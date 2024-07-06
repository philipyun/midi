import { MIDIJsError } from '../../common/error';
import { normalizeChannel } from '../common';
import { RawMidiMessage } from '../common/types';
import { serializeRawMIDIMessage } from '../parser/raw-message';
import {
  ChannelVoiceMessage,
  ChannelVoicePrefix,
  ChannelVoicePrefixMap,
  ChannelVoiceTypeMap,
  MIDIChannel,
} from './types';

const prefixIsChannelVoice = (prefix: number): prefix is ChannelVoicePrefix => {
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
    type: ChannelVoicePrefixMap[statusPrefix],
    channel,
    data1: message.data1,
    data2: message.data2,
  };
};

export const serializeChannelVoiceMessage = (message: ChannelVoiceMessage): Uint8Array => {
  const prefixByte = ChannelVoiceTypeMap[message.type] << 4;
  const channelByte = normalizeChannel(message.channel);
  const statusByte = prefixByte | channelByte;

  return serializeRawMIDIMessage({
    status: statusByte,
    data1: message.data1,
    data2: message.data2,
  });
};
