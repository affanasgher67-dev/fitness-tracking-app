import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function AppInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.inputBg,
    ...theme.shadow.sm,
  },
  containerFocused: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surface,
    ...theme.shadow.md,
  },
  input: {
    backgroundColor: 'transparent',
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    fontSize: Math.max(theme.text.body.fontSize, 16),
    fontWeight: '500' as const,
  },
});
