'use client';

import { LinkedMIDIPort } from '@philipyun-midi/midi/protocol';
import { useMIDI } from '../midi-provider';
import { parseMIDIMessage } from '@philipyun-midi/midi/message/parser';
import { serializeMIDIMessage } from '@philipyun-midi/midi/message/serializer';

export const MIDIConnect: React.FC = () => {
  const { midiPorts, refresh } = useMIDI();

  const handlePortClick = async (port: LinkedMIDIPort) => {
    const openPromises = [port.input.open(), port.output.open()];
    port.input.addEventListener('midimessage', e => {
      if (e.data) {
        const parsedMIDI = parseMIDIMessage(e.data);
        console.log('\x1b[36m🎸 ~ parsedMIDI:', parsedMIDI);
      }
    });
    await Promise.all(openPromises);
    refresh();
  };

  const testClick = () => {
    const rawMidiMsg = new Uint8Array([0b11000011, 0b00000111]);
    console.log('\x1b[36m🎸 ~ rawMidiMsg:', rawMidiMsg);
    const parsedMidiMsg = parseMIDIMessage(rawMidiMsg);
    console.log('\x1b[36m🎸 ~ parsedMidiMsg:', parsedMidiMsg);
    const serializedMidiMsg = serializeMIDIMessage(parsedMidiMsg);
    console.log('\x1b[36m🎸 ~ serializedMidiMsg:', serializedMidiMsg);

    const rawMidiMsg2 = new Uint8Array([0b10110011, 0b01100110, 0b01111111]);
    console.log('\x1b[36m🎸 ~ rawMidiMsg2:', rawMidiMsg2);
    const parsedMidiMsg2 = parseMIDIMessage(rawMidiMsg2);
    console.log('\x1b[36m🎸 ~ parsedMidiMsg2:', parsedMidiMsg2);
    const serializedMidiMsg2 = serializeMIDIMessage(parsedMidiMsg2);
    console.log('\x1b[36m🎸 ~ serializedMidiMsg2:', serializedMidiMsg2);
  };

  return (
    <div>
      <button onClick={testClick}>TEST</button>
      {midiPorts.map(port => {
        const { name, manufacturer, input, output } = port;
        const id = `${input.id} / ${output.id}`;
        return (
          <div key={`input-${id}`} style={{ paddingBottom: 24 }}>
            <div>{manufacturer}</div>
            <div>{name}</div>
            <div>{id}</div>
            <div>{input.connection && output.connection}</div>
            <button type="button" onClick={() => handlePortClick(port)}>
              Connect
            </button>
            <br />
          </div>
        );
      })}
    </div>
  );
};
