import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <ImageBackground
      source={require('../assets/images/welcome-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}> 
        <View style={styles.content}>
          <View style={styles.badge}>
            <View style={[styles.badgeGradient, { backgroundColor: theme.colors.buttonBg }]}> 
              <Text style={styles.badgeText}>🔥 FITNESS WORKOUT</Text>
            </View>
          </View>

          <Text style={styles.title}>TRANSFORM</Text>
          <Text style={styles.subtitle}>
            Train Smart. Stay Strong. Dominate.
          </Text>

          <View style={styles.features}>
            <Text style={styles.feature}>✓ Intense Workouts</Text>
            <Text style={styles.feature}>✓ Track Progress</Text>
            <Text style={styles.feature}>✓ Build Strength</Text>
          </View>

          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: theme.colors.buttonBg }]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>GET STARTED NOW</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  badge: {
    marginBottom: 30,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 40,
    fontWeight: '600',
    letterSpacing: 1,
  },
  features: {
    marginBottom: 50,
    alignItems: 'center',
  },
  feature: {
    fontSize: 15,
    color: theme.colors.accent3,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
