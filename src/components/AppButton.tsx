import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
}: Props) {
  const handlePress = () => onPress();

  // Primary: white background, black text
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={[styles.button, styles.primary]}
      >
        <Text style={[styles.text, styles.primaryText]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  // Outline / Secondary: transparent background, white border, white text
  if (variant === 'outline' || variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={[styles.button, styles.outline]}
      >
        <Text style={[styles.text, styles.outlineText]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  // Ghost: minimal, white text
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.button, styles.ghost]}
    >
      <Text style={[styles.text, styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadow.md,
  },
  innerButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.textPrimary,
    ...theme.text.button,
    textTransform: 'uppercase',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.textPrimary,
  },
  outlineText: {
    color: theme.colors.textPrimary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  primary: {
    backgroundColor: theme.colors.buttonBg,
  },
  primaryText: {
    color: theme.colors.buttonText,
  },
});
