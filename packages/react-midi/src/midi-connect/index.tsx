'use client';

import { LinkedMIDIPort } from '@philipyun-midi/midi/protocol';
import { useMIDI } from '../midi-provider';
import { parseMIDIMessage } from '@philipyun-midi/midi/message/parser';

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

  return (
    <div>
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
