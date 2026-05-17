import React, { useEffect, useState } from 'react';
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
import { loadActivePlan } from '../utils/plan';
import { logoutUser } from '../utils/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeBack'>;

export default function WelcomeBackScreen({ navigation }: Props) {
  const [activePlan, setActivePlan] = useState<number | null>(null);

  useEffect(() => {
    loadActivePlan().then(plan => setActivePlan(plan));
  }, []);

  const handleContinue = () => {
    if (activePlan) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Plans' }],
      });
    }
  };

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
              <Text style={styles.badgeText}>🔥 WELCOME BACK</Text>
            </View>
          </View>

          <Text style={styles.title}>READY?</Text>
          <Text style={styles.subtitle}>
            Let's crush today's goals.
          </Text>

          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: theme.colors.buttonBg }]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>CONTINUE TO YOUR PLAN</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logoutUser();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Not you? Logout</Text>
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
    textTransform: 'uppercase',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
