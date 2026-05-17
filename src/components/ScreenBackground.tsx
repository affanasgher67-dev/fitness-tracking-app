import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  children: React.ReactNode;
  source?: any;              // optional
  overlay?: 'light' | 'dark' | 'none';
};

export default function ScreenBackground({
  children,
  source,
  overlay = 'dark',
}: Props) {
  return (
    <ImageBackground
      source={
        source ??
        require('../assets/images/default-bg.jpg') // fallback image
      }
      resizeMode="cover"
      style={styles.background}
    >
      {overlay !== 'none' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            overlay === 'dark'
              ? { backgroundColor: 'rgba(0,0,0,0.7)' }
              : { backgroundColor: 'rgba(255,255,255,0.06)' },
          ]}
        />
      )}

      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});
