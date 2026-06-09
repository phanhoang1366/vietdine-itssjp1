'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface SocketContextType {
  socket: any | null; // Using any to mock Socket type
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  // WebSocket functionality has been removed for Vercel deployment.
  // Real-time updates will not work, manual refresh is required.
  return (
    <SocketContext.Provider value={{ socket: null, isConnected: false }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
