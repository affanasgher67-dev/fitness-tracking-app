import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  label: string;
  duration: number; // seconds
};

export default function ExerciseTimer({ label, duration }: Props) {
  const [time, setTime] = useState(duration);
  const [running, setRunning] = useState(false);

  const timePercent = (time / duration) * 100;
  const isWarning = time <= 10 && time > 0;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (running && time > 0) {
      timer = setTimeout(() => setTime(t => t - 1), 1000);
    }

    return () => clearTimeout(timer as unknown as number);
  }, [running, time]);

  const reset = () => {
    setTime(duration);
    setRunning(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, isWarning && styles.cardWarning]}>
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${timePercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={[styles.time, isWarning && styles.timeWarning]}>
          {time}s
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setRunning(!running)}
            style={styles.buttonContainer}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                {running ? '⏸ PAUSE' : '▶ START'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.resetButtonContainer}
            onPress={reset}
          >
            <View style={styles.resetButton}>
              <Text style={styles.resetText}>↻ RESET</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  card: {
    backgroundColor: 'transparent',
    padding: theme.spacing.lg,
    ...theme.shadow.md,
  },
  cardWarning: {
    // subtle treatment for warning state without using color outside grayscale
    borderColor: theme.colors.border,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  },
  time: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    letterSpacing: 1,
  },
  timeWarning: {
    color: theme.colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  buttonContainer: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.buttonBg,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  resetButtonContainer: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  resetButton: {
    borderWidth: 2,
    borderColor: theme.colors.textPrimary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
});
