import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { workouts } from '../data/workouts';
import { theme } from '../theme/theme';
import ScreenBackground from '../components/ScreenBackground';
import { getProgress } from '../utils/progress';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercises'>;

export default function ExercisesScreen({ route, navigation }: Props) {
  const { day, level } = route.params;
  const [completed, setCompleted] = useState(false);

  const plan = workouts[level];
  const workout = plan.find(w => w.day === day);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProgress = async () => {
        const progress = await getProgress();
        const completedDays = progress[level] ?? [];

        if (isActive) {
          setCompleted(completedDays.includes(day));
        }
      };

      loadProgress();

      return () => {
        isActive = false;
      };
    }, [day, level])
  );

  if (!workout) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Workout not found</Text>
      </View>
    );
  }

  return (
    <ScreenBackground
      source={require('../assets/images/exercise-bg.png')}
      overlay="dark"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Day {workout.day}</Text>
          <Text style={styles.subtitle}>{workout.title}</Text>
          <View
            style={[
              styles.statusBadge,
              completed && styles.statusBadgeCompleted,
            ]}
          >
            <Text style={styles.statusText}>
              {completed ? '✓ Completed' : '⏳ In Progress'}
            </Text>
          </View>
        </View>

        <FlatList
          data={workout.exercises}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('DayWorkout', {
                  day: workout.day,
                  level,
                })
              }
            >
                <View style={styles.exerciseCardGradient}>
                  <View style={styles.exerciseCard}>
                    <View style={styles.indexBadge}>
                      <View style={[styles.indexBg, { backgroundColor: theme.colors.buttonBg }]}> 
                        <Text style={styles.indexText}>{index + 1}</Text>
                      </View>
                    </View>

                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <View style={styles.durationContainer}>
                      <Text style={styles.exerciseDuration}>
                        ⏱ {item.duration}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.videoButton}
                    onPress={() => Linking.openURL(item.video)}
                  >
                    <View style={[styles.videoBg, { backgroundColor: theme.colors.buttonBg }]}> 
                      <Text style={styles.videoText}>▶</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 1,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusBadgeCompleted: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  statusText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  exerciseCardGradient: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    ...theme.shadow.sm,
  },
  indexBadge: {
    marginRight: theme.spacing.md,
  },
  indexBg: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDuration: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  videoButton: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  videoBg: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
