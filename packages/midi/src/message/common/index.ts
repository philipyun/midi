/**
 * normalizes a number to ensure it cannot be a higher value than 0xFF
 * @param number - number to normalize
 * @returns number formatted to one byte
 */
export const normalizeByte = (number: number) => {
  if (number > 0xff) {
    return 0xff;
  }
  return number;
};
