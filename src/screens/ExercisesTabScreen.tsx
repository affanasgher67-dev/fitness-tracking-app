import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { theme } from '../theme/theme';

type ExerciseItem = {
  name: string;
  duration: string;
  video: string;
  category: string;
};

export default function ExercisesTabScreen() {
  const [search, setSearch] = useState('');

  // Comprehensive static exercise list compiled from our plans database
  const exercises: ExerciseItem[] = [
    { name: 'Jumping Jacks', duration: '30-40 sec', video: 'https://youtu.be/c4DAnQ6DtF8', category: 'Cardio / HIIT' },
    { name: 'Burpees', duration: '10-15 reps', video: 'https://youtu.be/TU8QYVW0gDU', category: 'Cardio / HIIT' },
    { name: 'Mountain Climbers', duration: '30-40 sec', video: 'https://youtu.be/nmwgirgXLYM', category: 'Cardio / HIIT' },
    { name: 'High Knees', duration: '30-45 sec', video: 'https://youtu.be/OAJ_J3EZkdY', category: 'Cardio / HIIT' },
    { name: 'Bodyweight Squats', duration: '12-20 reps', video: 'https://youtu.be/aclHkVaku9U', category: 'Lower Body' },
    { name: 'Reverse Lunges', duration: '10-12 reps', video: 'https://youtu.be/QOVaHwm-Q6U', category: 'Lower Body' },
    { name: 'Calf Raises', duration: '20 reps', video: 'https://youtu.be/-M4-G8p8fmc', category: 'Lower Body' },
    { name: 'Wall Sit', duration: '30-45 sec', video: 'https://youtu.be/y-wV4Venusw', category: 'Lower Body' },
    { name: 'Knee Push Ups', duration: '10 reps', video: 'https://youtu.be/0GsVJsS6474', category: 'Upper Body' },
    { name: 'Push Ups', duration: '15 reps', video: 'https://youtu.be/IODxDxX7oi4', category: 'Upper Body' },
    { name: 'Wall Push Ups', duration: '12 reps', video: 'https://youtu.be/9xw5CxkIYbY', category: 'Upper Body' },
    { name: 'Diamond Push Ups', duration: '12 reps', video: 'https://youtu.be/J0DnG1_S92I', category: 'Upper Body' },
    { name: 'Plank', duration: '20-60 sec', video: 'https://youtu.be/pSHjTRCQxIw', category: 'Core' },
    { name: 'Crunches', duration: '15 reps', video: 'https://youtu.be/Xyd_fa5zoEU', category: 'Core' },
    { name: 'Leg Raises', duration: '10-15 reps', video: 'https://youtu.be/JB2oyawG9KI', category: 'Core' },
    { name: 'Russian Twists', duration: '20-30 reps', video: 'https://youtu.be/wkD8rjkodUI', category: 'Core' },
    { name: 'V Ups', duration: '15 reps', video: 'https://youtu.be/iP2fjvG0g3w', category: 'Core' },
    { name: 'Full Body Stretch', duration: '5-10 min', video: 'https://youtu.be/g_tea8ZNk5A', category: 'Mobility / Rest' },
  ];

  const filteredExercises = exercises.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Upper Body': return '#00F0FF';
      case 'Lower Body': return '#FF007F';
      case 'Core': return '#39FF14';
      case 'Cardio / HIIT': return '#FF9F00';
      default: return '#9D00FF';
    }
  };

  return (
    <ScreenBackground source={require('../assets/images/exercise-bg.png')} overlay="dark">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Exercises Library</Text>
          <Text style={styles.subtitle}>Explore techniques and view video guides</Text>
        </View>

        {/* 🔍 Premium Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search exercises or category..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={item => item.name}
          renderItem={({ item, index }) => (
            <View style={styles.cardGradient}>
              <View style={styles.card}>
                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, { backgroundColor: getCategoryColor(item.category) + '15', borderColor: getCategoryColor(item.category) + '40' }]}>
                    <Text style={[styles.badgeText, { color: getCategoryColor(item.category) }]}>
                      {item.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.contentRow}>
                  <View style={styles.info}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Text style={styles.exerciseDuration}>⏱ Target: {item.duration}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => Linking.openURL(item.video)}
                  >
                    <Text style={styles.playButtonText}>▶ GUIDE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          scrollEnabled={true}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: 50,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 50,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 80,
  },
  cardGradient: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(28, 28, 28, 0.4)',
    overflow: 'hidden',
  },
  card: {
    padding: theme.spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  exerciseDuration: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
