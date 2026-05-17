import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
// using default named `View` from the main react-native import above
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/theme';
import ExerciseTimer from '../components/ExerciseTimer';
import { markDayComplete } from '../utils/progress';
import { workouts, Level } from '../data/workouts';

type Props = NativeStackScreenProps<RootStackParamList, 'DayWorkout'>;

export default function DayWorkoutScreen({ route, navigation }: Props) {
  const { day, level } = route.params;

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [140, 80],
    extrapolate: 'clamp',
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [28, 18],
    extrapolate: 'clamp',
  });

  const dayWorkout = workouts[level as Level].find(
    d => d.day === day
  );

  if (!dayWorkout) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Workout not found</Text>
      </View>
    );
  }

  const handleComplete = async () => {
    try {
      await markDayComplete(level, day);
      Alert.alert('🔥 Completed', 'Workout marked as completed! You are unstoppable! 💪');
      navigation.goBack();
    } catch {
      Alert.alert(
        'Saved Locally',
        'Workout progress could not be stored persistently, but the completion was recorded for this session.'
      );
      navigation.goBack();
    }

  };

  return (
    <ImageBackground
      source={require('../assets/images/workout-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.screen}>
        <View style={styles.headerGradient}>
          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.Text style={[styles.headerText, { fontSize: titleSize }]}> ⚡ Day {dayWorkout.day} • {level.toUpperCase()}</Animated.Text>
            <Text style={styles.subTitle}>{dayWorkout.title}</Text>
          </Animated.View>
        </View>

        <Animated.ScrollView
          contentContainerStyle={styles.content}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <Text style={styles.sectionTitle}>🏋️ Your Workout</Text>

          {dayWorkout.exercises.map((exercise, index) => {
            let durationInSeconds = 30;

            if (exercise.duration.includes('min')) {
              durationInSeconds = parseInt(exercise.duration, 10) * 60;
            } else if (exercise.duration.includes('sec')) {
              durationInSeconds = parseInt(exercise.duration, 10);
            } else if (exercise.duration.includes('rep')) {
              // For reps-based exercises, use 45 seconds as default timer
              durationInSeconds = 45;
            }

            return (
              <ExerciseTimer
                key={index}
                label={exercise.name}
                duration={durationInSeconds}
              />
            );
          })}

          <TouchableOpacity
            style={styles.completeButtonContainer}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <View style={[styles.completeButton, { backgroundColor: theme.colors.buttonBg }]}> 
              <Text style={styles.completeText}>✓ MARK COMPLETE</Text>
              </View>
            </TouchableOpacity>
        </Animated.ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  screen: {
    flex: 1,
  },
  headerGradient: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  headerText: {
    color: theme.colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subTitle: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.lg,
    letterSpacing: 0.5,
  },
  completeButtonContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.lg,
  },
  completeButton: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
});
