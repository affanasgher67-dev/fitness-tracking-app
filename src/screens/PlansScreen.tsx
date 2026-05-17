import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ScreenBackground from '../components/ScreenBackground';
import { theme } from '../theme/theme';
import { saveActivePlan } from '../utils/plan';
import { logoutUser } from '../utils/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Plans'>;

export default function PlansScreen({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            await logoutUser();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}
          style={{ marginRight: 5 }}
        >
          <Text style={{ color: '#FF4444', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const plans = [
    { days: 30, desc: 'Foundation Builder', color: theme.gradients.primary },
    { days: 60, desc: 'Power Booster', color: theme.gradients.accent },
    { days: 90, desc: 'Elite Warrior', color: theme.gradients.neon },
  ];

  return (
    <ScreenBackground
      source={require('../assets/images/plans-bg.jpg')}
      overlay="dark"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            💪 Discipline • 🔥 Strength • 🚀 Growth
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={plan.days}
              onPress={async () => {
                await saveActivePlan(plan.days);
                navigation.navigate('MainTabs');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.cardGradient}>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.days}>{plan.days}</Text>
                    <Text style={styles.daysLabel}>DAYS</Text>
                  </View>
                  <Text style={styles.desc}>{plan.desc}</Text>
                  <View style={styles.badge}>
                    <View style={[styles.badgeGradient, { backgroundColor: theme.colors.buttonBg }]}> 
                      <Text style={styles.badgeText}>Start Now →</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    ...theme.text.title,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardsContainer: {
    gap: theme.spacing.lg,
  },
  cardGradient: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    ...theme.shadow.md,
  },
  card: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  cardHeader: {
    marginBottom: theme.spacing.md,
  },
  days: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  daysLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  desc: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  badge: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
