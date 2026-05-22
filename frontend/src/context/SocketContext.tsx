'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    // Connect to Socket.IO server with limited reconnection
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}`, {
      withCredentials: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Socket connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Socket disconnected');
    });

    newSocket.on('connect_error', (err) => {
      // Stop reconnecting on auth errors — session is invalid or missing
      const authErrors = ['Authentication required', 'Invalid session', 'Authentication failed'];
      if (authErrors.some(msg => err.message.includes(msg))) {
        console.warn('🔌 Socket auth failed, stopping reconnection');
        newSocket.disconnect();
      } else {
        console.warn('🔌 Socket connection error:', err.message);
      }
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
