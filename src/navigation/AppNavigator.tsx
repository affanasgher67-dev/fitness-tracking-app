import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/theme';

import WelcomeScreen from '../screens/WelcomeScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import LoginScreen from '../screens/LoginScreen';
import PlansScreen from '../screens/PlansScreen';
import PlanDetailsScreen from '../screens/PlanDetailsScreen';
import DayWorkoutScreen from '../screens/DayWorkoutScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import TabNavigator from './TabNavigator';
import { initializeAuth, isLoggedIn } from '../utils/auth';
import { loadActivePlan } from '../utils/plan';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [sessionLoggedIn, setSessionLoggedIn] = useState<boolean | null>(null);
  const [initialPlan, setInitialPlan] = useState<number | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      // Initialize auth from storage first
      await initializeAuth();
      const loggedIn = await isLoggedIn();
      setSessionLoggedIn(loggedIn);
      if (loggedIn) {
        const activePlan = await loadActivePlan();
        setInitialPlan(activePlan);
      }
    };
    checkLogin();
  }, []);

  // Show nothing while checking login status (optional: add a splash screen)
  if (sessionLoggedIn === null) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={sessionLoggedIn ? 'WelcomeBack' : 'Welcome'}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* Public Screens */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeBack"
        component={WelcomeBackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Authenticated Screens */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Plans"
        component={PlansScreen}
        options={{ title: 'Choose Plan' }}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDetailsScreen}
        options={{ title: 'Plan Details' }}
        initialParams={initialPlan ? { duration: initialPlan } : undefined}
      />
      <Stack.Screen
        name="DayExercises"
        component={ExerciseScreen}
        options={{ title: 'Exercises' }}
      />
      <Stack.Screen
        name="DayWorkout"
        component={DayWorkoutScreen}
        options={{ title: 'Workout' }}
      />
    </Stack.Navigator>
  );
}
