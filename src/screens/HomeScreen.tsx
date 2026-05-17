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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { workouts } from '../data/workouts';
import { theme } from '../theme/theme';
import ScreenBackground from '../components/ScreenBackground';
import { getProgress } from '../utils/progress';
import { saveActivePlan, loadActivePlan } from '../utils/plan';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [duration, setDuration] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState<number>(7); // Professional streak counter placeholder
  const [userName, setUserName] = useState<string>('Athlete');

  const planLabels = {
    beginner: '🔰 Beginner Plan',
    intermediate: '⚡ Intermediate Plan',
    advanced: '🔥 Advanced Plan',
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPlanAndProgress = async () => {
        const activePlan = await loadActivePlan();
        try {
          const savedName = await AsyncStorage.getItem('user_name');
          if (savedName && isActive) {
            setUserName(savedName);
          }
        } catch (err) {
          console.warn('Failed to load user name:', err);
        }

        if (activePlan && isActive) {
          setDuration(activePlan);
          const planLevel =
            activePlan === 30
               ? 'beginner'
               : activePlan === 60
               ? 'intermediate'
               : 'advanced';
          const progress = await getProgress();
          setCompletedDays(progress[planLevel] ?? []);
        } else if (isActive) {
          setDuration(null);
        }
      };

      loadPlanAndProgress();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const getImageForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('upper')) return require('../assets/images/upper_body.png');
    if (lowerTitle.includes('lower') || lowerTitle.includes('leg')) return require('../assets/images/lower_body.png');
    if (lowerTitle.includes('core')) return require('../assets/images/core_strength.png');
    if (lowerTitle.includes('cardio') || lowerTitle.includes('hiit') || lowerTitle.includes('explosive')) return require('../assets/images/cardio.png');
    if (lowerTitle.includes('recover') || lowerTitle.includes('rest') || lowerTitle.includes('mobility')) return require('../assets/images/active_recovery.png');
    return require('../assets/images/full_body.png');
  };

  if (!duration) {
    return (
      <ScreenBackground source={require('../assets/images/details-bg.png')} overlay="dark">
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.dashboardHeader}>
            <View>
              <Text style={styles.greetingText}>Hello, {userName}! 👋</Text>
              <Text style={styles.dashboardSubtitle}>Let's start your fitness journey today.</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak} Days</Text>
            </View>
          </View>

          <View style={styles.noPlanCard}>
            <Text style={styles.noPlanTitle}>No Active Workout Plan</Text>
            <Text style={styles.noPlanDesc}>
              To see your personalized dashboard, analysis chart, and track your daily progress, pick a plan!
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Plans')}
            >
              <Text style={styles.actionButtonText}>CHOOSE A WORKOUT PLAN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenBackground>
    );
  }

  const planLevel =
    duration === 30
      ? 'beginner'
      : duration === 60
      ? 'intermediate'
      : 'advanced';

  const plan = workouts[planLevel];
  const completionPercent = Math.round((completedDays.length / plan.length) * 100);
  const firstIncompleteIndex = plan.findIndex(d => !completedDays.includes(d.day));
  const activeDayIndex = firstIncompleteIndex === -1 ? plan.length - 1 : firstIncompleteIndex;
  const daysRemaining = plan.length - completedDays.length;
  const todayWorkout = plan[activeDayIndex] || plan[0];

  return (
    <ScreenBackground source={require('../assets/images/details-bg.png')} overlay="dark">
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* 👑 Modern Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.greetingText}>Hello, {userName}! 👋</Text>
            <Text style={styles.dashboardSubtitle}>Ready to crush today's session?</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak} Days</Text>
          </View>
        </View>

        {/* 🚀 Today's Workout Summary Card */}
        <View style={styles.todayCard}>
          <Text style={styles.todayTitle}>TODAY'S WORKOUT</Text>
          <View style={styles.todayContent}>
            <View style={styles.todayInfoContainer}>
              <Text style={styles.todayDayTitle}>
                Day {todayWorkout.day}: {todayWorkout.title}
              </Text>
              <Text style={styles.todayExercisesSummary}>
                📋 {todayWorkout.exercises.length} Exercises • ⏱ Average 15 mins
              </Text>
            </View>
            <TouchableOpacity
              style={styles.todayButton}
              onPress={() =>
                navigation.navigate('DayExercises', {
                  day: todayWorkout.day,
                  level: planLevel,
                })
              }
            >
              <Text style={styles.todayButtonText}>START</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📈 Fitness Path & Overall Progress */}
        <View style={styles.planHeaderSection}>
          <View style={styles.planLabelRow}>
            <Text style={styles.planTitleText}>
              {planLabels[planLevel]}
            </Text>
            <TouchableOpacity
              style={styles.changePlanBtn}
              onPress={async () => {
                await saveActivePlan(null);
                navigation.navigate('Plans');
              }}
            >
              <Text style={styles.changePlanText}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.planDurationText}>{duration} DAYS ROTATIONAL WARRIOR</Text>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedDays.length} / {plan.length} Days Complete ({daysRemaining} left)
            </Text>
          </View>
        </View>

        {/* 📊 High-End Data Visualization Chart */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>📊 WORKOUT ANALYSIS</Text>
          {(() => {
            const categories: Record<string, { total: number; completed: number; color: string }> = {
              'Upper Body': { total: 0, completed: 0, color: '#00F0FF' }, // Glowing Neon Cyan
              'Lower Body': { total: 0, completed: 0, color: '#FF007F' }, // Electric Neon Pink
              'Core': { total: 0, completed: 0, color: '#39FF14' }, // Intense Lime Green
              'Cardio & HIIT': { total: 0, completed: 0, color: '#FF9F00' }, // Vibrant Orange
              'Recovery': { total: 0, completed: 0, color: '#9D00FF' }, // Royal Violet
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

        {/* 📅 Active Plan Day List */}
        <Text style={styles.sectionTitle}>📅 WORKOUT SCHEDULE</Text>
        {plan.map((day, index) => {
          const isCompleted = completedDays.includes(day.day);
          const isInProgress = index === activeDayIndex && !isCompleted;

          return (
            <TouchableOpacity
              key={day.day}
              onPress={() =>
                navigation.navigate('DayExercises', {
                  day: day.day,
                  level: planLevel,
                })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.dayCardGradient, isCompleted && { opacity: 0.6 }]}>
                <View style={styles.dayCard}>
                  <View style={[styles.dayImageContainer, !isCompleted && isInProgress && styles.dayImageActive]}> 
                    <Image source={getImageForTitle(day.title)} style={styles.dayImage} />
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
    paddingTop: 50,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  dashboardSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 159, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 0, 0.4)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  streakText: {
    color: '#FF9F00',
    fontWeight: '800',
    fontSize: 13,
  },
  todayCard: {
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  todayTitle: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  todayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  todayDayTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  todayExercisesSummary: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  todayButton: {
    backgroundColor: '#00F0FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayButtonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 13,
  },
  noPlanCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: 30,
    alignItems: 'center',
    marginTop: 50,
  },
  noPlanTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
  },
  noPlanDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: theme.radius.lg,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000000',
    fontWeight: '800',
    letterSpacing: 1,
  },
  planHeaderSection: {
    marginBottom: theme.spacing.xl,
  },
  planLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  planTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  changePlanBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  changePlanText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  planDurationText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  progressBarContainer: {
    marginTop: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#00F0FF',
  },
  progressText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  dayCardGradient: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(28, 28, 28, 0.4)',
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  dayImageContainer: {
    marginRight: theme.spacing.md,
    position: 'relative',
    borderRadius: 12,
  },
  dayImageActive: {
    borderWidth: 2,
    borderColor: '#00F0FF',
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
    backgroundColor: '#00F0FF',
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
    color: '#00F0FF',
  },
  continueButton: {
    marginTop: 8,
    backgroundColor: '#00F0FF',
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
    color: '#00F0FF',
    fontSize: 24,
    fontWeight: '700',
  },
  analyticsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  analyticsTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
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
    fontSize: 13,
    fontWeight: '600',
  },
  chartProgress: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '700',
  },
  chartBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
