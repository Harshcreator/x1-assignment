import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ethers } from 'ethers';
import WebView from 'react-native-webview';

const X1TokenAddress = '0xe038B1f7809C77dbe87400c6389704c90883E99E';
const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function getStakeInfo(address staker) external view returns (uint256, uint256)",
  "function totalSupply() public view returns (uint256)"
];

const initialSupply = 1000000; // 1,000,000 X1TC

const WalletConnector: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [burnedTokens, setBurnedTokens] = useState<string>('0');

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) throw new Error("MetaMask not found");

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      const tokenContract = new ethers.Contract(X1TokenAddress, abi, provider);

      // Fetch balance
      const balance = await tokenContract.balanceOf(userAddress);
      setBalance(ethers.formatUnits(balance, 18));

      // Fetch staked amount
      const [stakedAmount] = await tokenContract.getStakeInfo(userAddress);
      setStakedAmount(ethers.formatUnits(stakedAmount, 18));

      // Calculate burned tokens
      const totalSupply = await tokenContract.totalSupply();
      const burned = initialSupply - Number(ethers.formatUnits(totalSupply, 18));
      setBurnedTokens(burned.toString());

      console.log("Connected: ", userAddress);
    } catch (error) {
      console.error("Wallet connection error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>X1TestCoin Dashboard</Text>
      {address ? (
        <View>
          <Text>Connected Wallet: {address}</Text>
          <Text>Balance: {balance} X1TC</Text>
          <Text>Staked: {stakedAmount} X1TC</Text>
          <Text>Total Burned: {burnedTokens} X1TC</Text>
        </View>
      ) : (
        <Button title="Connect Wallet" onPress={connectWallet} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, marginBottom: 20 },
});

export default WalletConnector;
