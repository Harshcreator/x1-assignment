import React from 'react';
import TabLayout from './_layout';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default function HomeScreen() {
  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: 'white', dark: 'black' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.headerImage}
          />
        }>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Welcome to X1 Racing
        </ThemedText>
      </View>
    </ParallaxScrollView>
  );
}



