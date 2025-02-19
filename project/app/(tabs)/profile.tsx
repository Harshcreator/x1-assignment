import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../../src/context/WalletContext';

export default function ProfileScreen() {
  const { address, connectWallet, isConnected } = useWallet();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.title}>Profile</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Wallet Status</Text>
          {isConnected ? (
            <Text style={styles.walletAddress}>
              {`${address!.slice(0, 6)}...${address!.slice(-4)}`}
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectWallet}
            >
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Meditation Stats</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Time</Text>
            <Text style={styles.statValue}>0 min</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rewards Earned</Text>
            <Text style={styles.statValue}>0 X1C</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  walletCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  walletLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  walletAddress: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});