'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AvailableMIDIPorts, requestMIDIAccess } from '@philipyun-midi/midi/protocol/permissions';

interface MIDIContextValue {
  midiPorts: AvailableMIDIPorts | null;
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

  useEffect(() => {
    const init = async () => {
      const access = await requestMIDIAccess();
      setMidiPorts(access);
    };
    init();
  }, []);

  const contextValue: MIDIContextValue = {
    midiPorts,
  };

  return <MIDIContext.Provider value={contextValue}>{children}</MIDIContext.Provider>;
};
