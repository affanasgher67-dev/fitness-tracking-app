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
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Profile'}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Unlock your potential'
            : 'Join the elite community'}
        </Text>

        <View style={styles.cardGradient}>
          <Animated.View style={[styles.card, { height: cardHeight }]} pointerEvents="auto">
            <AppInput
              placeholder="Email"
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

            <AppButton title={isLogin ? 'Login' : 'Sign Up'} onPress={handleSubmit} variant="primary" />

            <TouchableOpacity style={styles.switchTextContainer} onPress={toggleMode}>
                <Text style={styles.switchText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text style={styles.linkText}>{isLogin ? 'Sign Up' : 'Login'}</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    ...theme.text.title,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontSize: 28,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardGradient: {
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.lg,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  errorText: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  switchTextContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
});
