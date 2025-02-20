import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from '../src/context/WalletContext';
import { AuthProvider } from '../src/context/AuthContext';

declare global {
  interface Window {
    frameworkReady?: () => void;
    ethereum?: any;
  }
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <AuthProvider>
      <WalletProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </WalletProvider>
    </AuthProvider>
  );
}