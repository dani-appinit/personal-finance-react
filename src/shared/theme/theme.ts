// MUI Theme Configuration
import { createTheme } from '@mui/material/styles';

type ThemeColor = 'blue' | 'purple' | 'green';
type PaletteMode = 'light' | 'dark';

const colorPalettes = {
  blue: {
    main: '#2563eb',
    light: '#3b82f6',
    dark: '#1d4ed8',
  },
  purple: {
    main: '#9333ea',
    light: '#a855f7',
    dark: '#7e22ce',
  },
  green: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857',
  },
};

export const createAppTheme = (mode: PaletteMode, color: ThemeColor) => {
  const selectedColor = colorPalettes[color];
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: selectedColor.main,
        light: selectedColor.light,
        dark: selectedColor.dark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#64748b',
        light: '#94a3b8',
        dark: '#475569',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
      },
      info: {
        main: '#3b82f6',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -1px rgb(0 0 0 / 0.2)',
          },
        },
      },
    },
  });
};
