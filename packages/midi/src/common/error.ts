export class MIDIJsError extends Error {
  constructor(functionName: string, errorMessage: string) {
    super();
    this.name = 'midi.js Error';
    this.message = `midi.js Error: ${functionName}::${errorMessage}`;
  }
}
