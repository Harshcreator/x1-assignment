import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useWallet } from '../../src/context/WalletContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signIn, signUp, logout } = useAuth();
  const { address, connectWallet, isConnected } = useWallet();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  if (user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.header}
        >
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
              style={styles.avatar}
            />
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
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

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? 'Sign up to track your meditation progress'
            : 'Sign in to continue your journey'}
        </Text>
      </LinearGradient>

      <View style={styles.authContent}>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.authButton, loading && styles.authButtonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.switchButtonText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  emailText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  authContent: {
    padding: 20,
    marginTop: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  authButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonDisabled: {
    backgroundColor: '#ccc',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#4c669f',
    fontSize: 14,
  },
  walletCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
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
    borderRadius: 8,
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
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
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
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});