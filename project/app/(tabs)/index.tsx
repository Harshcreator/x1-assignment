import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../../src/context/WalletContext';

export default function Dashboard() {
  const { balance, stakedAmount, burnedCoins, penalize, isConnected } = useWallet();

  const handlePenalize = async () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    try {
      await penalize();
      Alert.alert('Success', 'Penalty applied successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to apply penalty');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.title}>X1Coin Dashboard</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>{balance} X1C</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Staked</Text>
          <Text style={styles.statValue}>{stakedAmount} X1C</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Burned</Text>
          <Text style={styles.statValue}>{burnedCoins} X1C</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.penalizeButton, !isConnected && styles.penalizeButtonDisabled]}
        onPress={handlePenalize}
        disabled={!isConnected}
      >
        <Text style={styles.penalizeButtonText}>Penalize (20%)</Text>
      </TouchableOpacity>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 100,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  penalizeButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  penalizeButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  penalizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});