import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  name: string;
  time: number;
  image: ImageSourcePropType;
};

export default function ExerciseCard({ name, time, image }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="cover" />
          <View style={styles.imageBorder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeDot} />
            <Text style={styles.time}>{time} seconds</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    ...theme.shadow.sm,
  },
  imageContainer: {
    position: 'relative',
    marginRight: theme.spacing.lg,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.textMuted,
    marginRight: theme.spacing.xs,
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
