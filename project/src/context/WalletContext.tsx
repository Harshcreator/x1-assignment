import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers, Provider } from 'ethers';
import { Alert, Platform } from 'react-native';
import { X1CoinABI } from '../contracts/X1CoinABI';

interface WalletContextType {
  address: string | null;
  balance: string;
  stakedAmount: string;
  burnedCoins: string;
  connectWallet: () => Promise<void>;
  penalize: () => Promise<void>;
  isConnected: boolean;
  chainId: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

const CONTRACT_ADDRESS = '0xe038B1f7809C77dbe87400c6389704c90883E99E';
const REQUIRED_CHAIN_ID = '0xaa36a7'; // Sepolia testnet

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [stakedAmount, setStakedAmount] = useState('0');
  const [burnedCoins, setBurnedCoins] = useState('0');
  const [chainId, setChainId] = useState<string | null>(null);

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId);
    // Reset state when chain changes
    setAddress(null);
    setBalance('0');
    setBurnedCoins('0');
    setStakedAmount('0');
  };

  const checkNetwork = async () => {
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(currentChainId);

      if (currentChainId !== REQUIRED_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: REQUIRED_CHAIN_ID }],
          });
          return true;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            throw new Error('Please add Sepolia to your wallet');
          } else {
            throw new Error('Please switch to Sepolia');
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      throw error;
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (Platform.OS !== 'web') {
        throw new Error('Wallet connection is only supported on web platform');
      }

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      await checkNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const userAddress = accounts[0].address;
        setAddress(userAddress);
        await updateBalance(userAddress, provider);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      if (error instanceof Error) {
        Alert.alert('Connection Error', error.message);
      }
    }
  };

  const updateBalance = async (userAddress: string, provider: ethers.BrowserProvider) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, X1CoinABI, provider);

      // Add debug logging
      console.log('Contract address:', CONTRACT_ADDRESS);
      console.log('User address:', userAddress);

      // First verify if the contract exists
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error('Contract not deployed at specified address');
      }

      const userBalance = await contract.balanceOf(userAddress);
      console.log('Raw balance:', userBalance);
      setBalance(ethers.formatEther(userBalance));

    } catch (error: any) {
      console.error('Error updating balance:', error);
      if (error?.code === 'CALL_EXCEPTION') {
        console.error('Contract call exception:', error);

        // Check if contract exists but call failed
        throw new Error('Contract call failed - verify contract deployment and ABI');
      } else if (error instanceof Error) {
        throw new Error(`Failed to fetch balance: ${error.message}`);
      } else {
        throw new Error('Failed to fetch balance: Unknown error');
      }
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (Platform.OS === 'web' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          updateBalance(accounts[0], provider);
        } else {
          setAddress(null);
          setBalance('0');
        }
      });

      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (Platform.OS === 'web' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => { });
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (Platform.OS !== 'web') {
        throw new Error('Wallet connection is only supported on web platform');
      }

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      await checkNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please check your MetaMask configuration.');
      }

      const userAddress = accounts[0];
      setAddress(userAddress);

      await updateBalance(userAddress, provider);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to connect wallet');
    }
  };

  const penalize = async () => {
    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (chainId !== REQUIRED_CHAIN_ID) {
        throw new Error('Please switch to Ethereum Mainnet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, X1CoinABI, signer);

      // Get current balance
      const currentBalance = await contract.balanceOf(address);

      if (currentBalance <= 0) {
        throw new Error('Insufficient balance');
      }

      // Calculate penalty amount (20% of current balance)
      const penaltyAmount = (currentBalance * BigInt(20)) / BigInt(100);

      // Estimate gas before sending transaction
      try {
        await contract.burn.estimateGas(penaltyAmount);
      } catch (error) {
        console.error('Gas estimation failed:', error);
        throw new Error('Transaction would fail - you might not have permission to burn tokens or the contract might be paused');
      }

      // Send transaction with explicit gas limit
      const tx = await contract.burn(penaltyAmount, {
        gasLimit: 100000 // Set a reasonable gas limit
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (!receipt.status) {
        throw new Error('Transaction failed');
      }

      // Update balances after successful penalty
      const newBalance = await contract.balanceOf(address);
      setBalance(ethers.formatEther(newBalance));
      setBurnedCoins(prev => (Number(prev) + Number(ethers.formatEther(penaltyAmount))).toString());

    } catch (error) {
      console.error('Error applying penalty:', error);
      if (error instanceof Error) {
        if (error.message.includes('user rejected')) {
          throw new Error('Transaction was rejected by user');
        } else if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds to cover gas fees');
        } else {
          throw new Error(error.message || 'Failed to apply penalty');
        }
      }
      throw new Error('Failed to apply penalty');
    }
  };

  const value = {
    address,
    balance,
    stakedAmount,
    burnedCoins,
    connectWallet,
    penalize,
    isConnected: !!address,
    chainId,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}