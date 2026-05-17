import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ScreenBackground from '../components/ScreenBackground';
import { theme } from '../theme/theme';
import { logoutUser } from '../utils/auth';
import { loadActivePlan, saveActivePlan } from '../utils/plan';
import { getProgress } from '../utils/progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export default function ProfileScreen({ navigation }: Props) {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [userName, setUserName] = useState<string>('Athlete');
  const [userEmail, setUserEmail] = useState<string>('athlete@example.com');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfileData = async () => {
        const plan = await loadActivePlan();
        try {
          const savedName = await AsyncStorage.getItem('user_name');
          const savedEmail = await AsyncStorage.getItem('user_email');
          if (savedName && isActive) setUserName(savedName);
          if (savedEmail && isActive) setUserEmail(savedEmail);
        } catch (err) {
          console.warn('Failed to load user profile credentials:', err);
        }

        if (isActive) {
          setActivePlan(plan);
          if (plan) {
            const planLevel =
              plan === 30
                ? 'beginner'
                : plan === 60
                ? 'intermediate'
                : 'advanced';
            const progress = await getProgress();
            const completed = progress[planLevel] ?? [];
            setCompletedDaysCount(completed.length);
          } else {
            setCompletedDaysCount(0);
          }
        }
      };

      loadProfileData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const getPlanLabel = () => {
    if (!activePlan) return 'No Active Plan';
    if (activePlan === 30) return '🔰 Beginner (30 Days)';
    if (activePlan === 60) return '⚡ Intermediate (60 Days)';
    return '🔥 Advanced (90 Days)';
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
      return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
    }
    return 'AT';
  };

  const handleLogout = async () => {
    await logoutUser();
    try {
      await AsyncStorage.removeItem('user_name');
      await AsyncStorage.removeItem('user_email');
    } catch (err) {
      console.warn('Failed to clear credentials on logout:', err);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScreenBackground source={require('../assets/images/welcome-bg.jpg')} overlay="dark">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>

        {/* 👤 User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          <View style={styles.divider} />

          {/* 📊 Streak and Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>🔥 7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>✅ {completedDaysCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>🚀 Rank</Text>
              <Text style={styles.statLabel}>Warrior</Text>
            </View>
          </View>
        </View>

        {/* ⚙️ Program Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WORKOUT PROGRAM</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Path:</Text>
            <Text style={styles.infoValue}>{getPlanLabel()}</Text>
          </View>

          {activePlan && (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={async () => {
                await saveActivePlan(null);
                navigation.navigate('Plans');
              }}
            >
              <Text style={styles.outlineButtonText}>CHANGE PLAN</Text>
            </TouchableOpacity>
          )}

          {!activePlan && (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => navigation.navigate('Plans')}
            >
              <Text style={styles.outlineButtonText}>CHOOSE A PLAN</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 🚪 Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>LOGOUT SESSION</Text>
        </TouchableOpacity>
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
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    elevation: 8,
    shadowColor: '#00F0FF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00F0FF',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: 10,
  },
  outlineButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
    paddingVertical: 16,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  logoutButtonText: {
    color: '#FF4444',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
});
