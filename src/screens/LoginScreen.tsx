import React, { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, Easing, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/theme';

import ScreenBackground from '../components/ScreenBackground';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { loginUser, isLoggedIn } from '../utils/auth'; // in-memory auth
import { loadActivePlan } from '../utils/plan';

import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Animated values
  const cardHeight = useRef(new Animated.Value(250)).current;
  const confirmOpacity = useRef(new Animated.Value(0)).current;

  // Animate card height and confirm password opacity
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardHeight, {
        toValue: isLogin ? 380 : 450,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(confirmOpacity, {
        toValue: isLogin ? 0 : 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLogin, cardHeight, confirmOpacity]);

  // If user is already logged in (in-memory), navigate directly
  useEffect(() => {
    const checkLogin = async () => {
      if (await isLoggedIn()) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'WelcomeBack' }],
        });
      }
    };
    checkLogin();
  }, [navigation]);

  const handleSubmit = async () => {
    if (!email.includes('@') || password.length < 6) {
      setError('Invalid email or password');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await AsyncStorage.setItem('user_email', email);
      const namePart = email.split('@')[0];
      const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      await AsyncStorage.setItem('user_name', capitalizedName);
    } catch (err) {
      console.warn('Failed to save user credentials:', err);
    }

    await loginUser(); // login in-memory

    navigation.reset({
      index: 0,
      routes: [{ name: 'WelcomeBack' }],
    });
  };

  const toggleMode = () => {
    setIsLogin(prev => !prev);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <ScreenBackground source={require('../assets/images/login-bg.jpg')} overlay="dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>🔥 GYM ELITE</Text>
        </View>

        <View style={styles.avatarIconContainer}>
          <Text style={styles.avatarIcon}>{isLogin ? '🔑' : '👤'}</Text>
        </View>

        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Profile'}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Access your elite workout routines'
            : 'Join the community and conquer goals'}
        </Text>

        <Animated.View style={[styles.card, { height: cardHeight }]} pointerEvents="auto">
          <AppInput
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
          />

          <AppInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
          />

          {!isLogin && (
            <Animated.View style={{ opacity: confirmOpacity }}>
              <AppInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                secureTextEntry
              />
            </Animated.View>
          )}

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonWrapper}>
            <AppButton title={isLogin ? 'Sign In' : 'Register Now'} onPress={handleSubmit} variant="primary" />
          </View>

          <TouchableOpacity style={styles.switchTextContainer} onPress={toggleMode}>
            <Text style={styles.switchText}>
              {isLogin ? "New here? " : 'Already registered? '}
              <Text style={styles.linkText}>{isLogin ? 'Create Account' : 'Sign In'}</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  logoBadge: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  logoBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  avatarIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarIcon: {
    fontSize: 26,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  buttonWrapper: {
    marginTop: 10,
  },
  errorText: {
    color: '#FF4444',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
  },
  switchTextContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  linkText: {
    color: '#ffffff',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
