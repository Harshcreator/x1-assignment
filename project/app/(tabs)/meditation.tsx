import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';

const MOVEMENT_THRESHOLD = 0.3;
const MEDITATION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function MeditationScreen() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MEDITATION_DURATION);
  const [movementViolations, setMovementViolations] = useState(0);
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let subscription: any = null;
    let timer: NodeJS.Timeout | null = null;

    if (isSessionActive) {
      // Start accelerometer monitoring
      subscription = Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
      });
      Accelerometer.setUpdateInterval(1000);

      // Start timer
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => {
      subscription && subscription.remove();
      if (timer) clearInterval(timer);
    };
  }, [isSessionActive]);

  useEffect(() => {
    if (isSessionActive) {
      const movement = Math.sqrt(x * x + y * y + z * z);
      if (movement > MOVEMENT_THRESHOLD) {
        setMovementViolations((prev) => prev + 1);
      }
    }
  }, [x, y, z, isSessionActive]);

  const handleSessionComplete = () => {
    setIsSessionActive(false);
    // TODO: Implement reward logic
    console.log('Session completed with violations:', movementViolations);
  };

  const startSession = () => {
    setIsSessionActive(true);
    setTimeRemaining(MEDITATION_DURATION);
    setMovementViolations(0);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.title}>Meditation Session</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.violationsText}>
            Movement Violations: {movementViolations}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            isSessionActive && styles.startButtonDisabled,
          ]}
          onPress={startSession}
          disabled={isSessionActive}
        >
          <Text style={styles.startButtonText}>
            {isSessionActive ? 'Session in Progress' : 'Start Session'}
          </Text>
        </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  violationsText: {
    fontSize: 16,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});