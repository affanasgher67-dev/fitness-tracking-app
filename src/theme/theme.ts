export const theme = {
  colors: {
    // Black / white / ash gray palette
    background: '#0f0f0f',
    surface: '#1c1c1c',
    card: '#1c1c1c',

    // Semantic colors (grayscale only)
    primary: '#f5f5f5', // used for headings / emphasis
    accent: '#ffffff', // pure white for special emphasis only
    accent2: '#cfcfcf',
    accent3: '#9a9a9a',

    // Typography
    textPrimary: '#f5f5f5',
    textSecondary: '#c0c0c0',
    textMuted: '#9a9a9a',
    textSmall: '#777777',

    border: '#2e2e2e',
    borderAccent: '#2e2e2e',
    inputBg: '#202020',
    buttonBg: '#ffffff',
    buttonText: '#000000',
  },

  spacing: {
    xs: 6,
    sm: 12,
    md: 20,
    lg: 28,
    xl: 36,
  },

  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },

  text: {
    title: {
      fontSize: 32,
      fontWeight: '800' as const,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 14,
      letterSpacing: 0.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '500' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '700' as const,
      letterSpacing: 0.5,
    },
  },

  gradients: {
    // Keep flat grayscale fallbacks so existing code that references gradients
    // doesn't break. These are intentionally neutral (no colored gradients).
    primary: ['#1c1c1c', '#1c1c1c'],
    accent: ['#ffffff', '#ffffff'],
    neon: ['#1c1c1c', '#2a2a2a', '#cfcfcf'],
    dark: ['#0f0f0f', '#111111'],
    cta: ['#ffffff', '#ffffff'],
  },

  shadow: {
    sm: {
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    md: {
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000000',
      shadowOpacity: 0.45,
      shadowRadius: 14,
      elevation: 10,
    },
  },
};
