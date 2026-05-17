import React, { useCallback, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { workouts } from '../data/workouts';
import { theme } from '../theme/theme';
import ScreenBackground from '../components/ScreenBackground';
import { getProgress } from '../utils/progress';
import { saveActivePlan } from '../utils/plan';
import { logoutUser } from '../utils/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanDetails'>;

export default function PlanDetailsScreen({ navigation, route }: Props) {
  const { duration } = route.params;
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const planLabels = {
    beginner: '🔰 Beginner',
    intermediate: '⚡ Intermediate',
    advanced: '🔥 Advanced',
  };

  const planLevel =
    duration === 30
      ? 'beginner'
      : duration === 60
      ? 'intermediate'
      : 'advanced';

  const plan = workouts[planLevel];

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={async () => {
              await logoutUser();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }}
            style={{ marginLeft: 5 }}
          >
            <Text style={{ color: '#FF4444', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 }}>Logout</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={async () => {
              await saveActivePlan(null);
              navigation.reset({ index: 0, routes: [{ name: 'Plans' }] });
            }}
          >
            <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 16 }}>Change</Text>
          </TouchableOpacity>
        ),
      });

      let isActive = true;

      const loadProgress = async () => {
        const progress = await getProgress();
        if (isActive) {
          setCompletedDays(progress[planLevel] ?? []);
        }
      };

      loadProgress();

      return () => {
        isActive = false;
      };
    }, [planLevel])
  );

  const completionPercent = Math.round((completedDays.length / plan.length) * 100);
  const firstIncompleteIndex = plan.findIndex(d => !completedDays.includes(d.day));
  const activeDayIndex = firstIncompleteIndex === -1 ? plan.length - 1 : firstIncompleteIndex;
  const daysRemaining = plan.length - completedDays.length;

  const getImageForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('upper')) return require('../assets/images/upper_body.png');
    if (lowerTitle.includes('lower') || lowerTitle.includes('leg')) return require('../assets/images/lower_body.png');
    if (lowerTitle.includes('core')) return require('../assets/images/core_strength.png');
    if (lowerTitle.includes('cardio') || lowerTitle.includes('hiit') || lowerTitle.includes('explosive')) return require('../assets/images/cardio.png');
    if (lowerTitle.includes('recover') || lowerTitle.includes('rest') || lowerTitle.includes('mobility')) return require('../assets/images/active_recovery.png');
    // default / full body
    return require('../assets/images/full_body.png');
  };

  return (
    <ScreenBackground
      source={require('../assets/images/details-bg.png')}
      overlay="dark"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {planLabels[planLevel]}
          </Text>
          <Text style={styles.duration}>{duration} DAYS</Text>
          <Text style={styles.subtitleText}>
            7 Day Rotational Warrior Program
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completedDays.length} / {plan.length} Days Complete ({daysRemaining} left)
            </Text>
          </View>
        </View>

        {/* 📊 Data Visualization Section */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>📊 WORKOUT ANALYSIS</Text>
          {(() => {
            const categories: Record<string, { total: number; completed: number; color: string }> = {
              'Upper Body': { total: 0, completed: 0, color: '#3A86F7' },
              'Lower Body': { total: 0, completed: 0, color: '#FF007F' },
              'Core': { total: 0, completed: 0, color: '#00FFD4' },
              'Cardio & HIIT': { total: 0, completed: 0, color: '#FF9F00' },
              'Recovery': { total: 0, completed: 0, color: '#7000FF' },
            };

            plan.forEach(day => {
              const lower = day.title.toLowerCase();
              let cat = 'Upper Body';
              if (lower.includes('lower') || lower.includes('leg')) cat = 'Lower Body';
              else if (lower.includes('core')) cat = 'Core';
              else if (lower.includes('cardio') || lower.includes('hiit') || lower.includes('explosive')) cat = 'Cardio & HIIT';
              else if (lower.includes('recover') || lower.includes('rest') || lower.includes('mobility')) cat = 'Recovery';

              categories[cat].total += 1;
              if (completedDays.includes(day.day)) {
                categories[cat].completed += 1;
              }
            });

            return Object.entries(categories).map(([name, data]) => {
              const percent = data.total > 0 ? (data.completed / data.total) * 100 : 0;
              return (
                <View key={name} style={styles.chartRow}>
                  <View style={styles.chartLabelContainer}>
                    <Text style={styles.chartName}>{name}</Text>
                    <Text style={styles.chartProgress}>
                      {data.completed}/{data.total}
                    </Text>
                  </View>
                  <View style={styles.chartBarBackground}>
                    <View 
                      style={[
                        styles.chartBarFill, 
                        { 
                          width: `${percent === 0 ? 5 : percent}%`, 
                          backgroundColor: data.color,
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            });
          })()}
        </View>

        {plan.map((day, index) => {
          const isCompleted = completedDays.includes(day.day);
          const isInProgress = index === activeDayIndex && !isCompleted;

          return (
            <TouchableOpacity
              key={day.day}
              onPress={() =>
                navigation.navigate('DayExercises', {
                  level: planLevel,
                  day: day.day,
                })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.dayCardGradient, isCompleted && { opacity: 0.6 }]}>
                <View style={styles.dayCard}>
                  <View style={[styles.dayImageContainer, !isCompleted && isInProgress && styles.dayImageActive]}> 
                    <Image 
                      source={getImageForTitle(day.title)} 
                      style={styles.dayImage} 
                    />
                    <View style={[styles.dayBadge, isCompleted && { backgroundColor: theme.colors.textMuted }]}>
                      <Text style={styles.dayBadgeText}>{index + 1}</Text>
                    </View>
                  </View>

                  <View style={styles.dayInfo}>
                    <Text style={[styles.dayText, isCompleted && { color: theme.colors.textMuted }]}>{day.title}</Text>
                    <Text
                      style={[
                        styles.status,
                        isCompleted && styles.statusCompleted,
                        isInProgress && styles.statusInProgress,
                      ]}
                    >
                      {isCompleted ? '✅ Completed' : isInProgress ? '🔵 In Progress' : '⬜ Not Started'}
                    </Text>
                    {isInProgress && (
                      <View style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.arrow}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  duration: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.accent3,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  subtitleText: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginTop: theme.spacing.lg,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
  progressText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  dayCardGradient: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    ...theme.shadow.sm,
  },
  dayImageContainer: {
    marginRight: theme.spacing.md,
    position: 'relative',
    borderRadius: 12,
  },
  dayImageActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  dayImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },
  dayBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  dayBadgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
  dayInfo: {
    flex: 1,
  },
  dayText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  status: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusCompleted: {
    color: theme.colors.textPrimary,
  },
  statusInProgress: {
    color: theme.colors.primary,
  },
  continueButton: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
  },
  arrow: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  analyticsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  analyticsTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  chartRow: {
    marginBottom: theme.spacing.md,
  },
  chartLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chartName: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chartProgress: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  chartBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
