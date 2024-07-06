import { UInt7, UInt8 } from './ranges';
import { MIDIChannel } from './types';

/**
 * normalizes a number to ensure it cannot be a higher value than 0xFF
 * @param number - number to normalize
 * @returns number formatted to one byte
 */
export const normalizeUInt7 = (number: number): UInt7 => {
  if (number > 0x7f) {
    return 0x7f;
  }
  if (number < 0x00) {
    return 0x00;
  }
  return number as UInt7;
};

/**
 * normalizes a number to ensure it cannot be a higher value than 0xFF
 * @param number - number to normalize
 * @returns number formatted to one byte
 */
export const normalizeUInt8 = (number: number): UInt8 => {
  if (number > 0xff) {
    return 0xff;
  }
  if (number < 0x00) {
    return 0x00;
  }
  return number as UInt8;
};

export const normalizeChannel = (channel: MIDIChannel): number => {
  return channel - 1;
};
