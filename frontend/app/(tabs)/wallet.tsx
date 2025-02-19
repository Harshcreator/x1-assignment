import React from 'react';
import { SafeAreaView } from 'react-native';
import WalletConnector from '../../components/WalletConnector';

const WalletScreen = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <WalletConnector />
  </SafeAreaView>
);

export default WalletScreen;