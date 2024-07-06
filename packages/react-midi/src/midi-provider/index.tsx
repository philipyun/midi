'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AvailableMIDIPorts, requestMIDIAccess } from '@philipyun-midi/midi/protocol';

interface MIDIContextValue {
  midiPorts: AvailableMIDIPorts;
  refresh: () => void;
}

interface MIDIContextProps {
  children: ReactNode;
}

const MIDIContext = createContext({} as MIDIContextValue);

export const useMIDI = () => {
  return useContext(MIDIContext);
};

export const MIDIProvider: React.FC<MIDIContextProps> = ({ children }) => {
  const [midiPorts, setMidiPorts] = useState<AvailableMIDIPorts | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const requestMidi = async () => {
    const access = await requestMIDIAccess();
    setMidiPorts(access);
  };

  useEffect(() => {
    requestMidi();
  }, []);

  if (midiPorts === null) {
    return <div>loading midi ports...</div>;
  }

  const contextValue: MIDIContextValue = {
    midiPorts,
    refresh: () => setRefreshCount(refreshCount + 1),
  };

  return <MIDIContext.Provider value={contextValue}>{children}</MIDIContext.Provider>;
};
