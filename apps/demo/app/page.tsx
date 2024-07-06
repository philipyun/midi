import { MIDIConnect } from '@philipyun-midi/react-midi/midi-connect';
import { MIDIProvider } from '@philipyun-midi/react-midi/midi-provider';

export default function Home() {
  return (
    <MIDIProvider>
      <MIDIConnect />
    </MIDIProvider>
  );
}
