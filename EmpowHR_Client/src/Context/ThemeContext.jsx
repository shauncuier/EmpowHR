import React, { createContext, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#00897b',
        light: '#4db6ac',
        dark: '#00695c',
      },
      secondary: {
        main: '#ff7043',
        light: '#ffab91',
        dark: '#e64a19',
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
      text: {
        primary: '#2c3e50',
        secondary: '#546e7a',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      error: {
        main: '#f44336',
        light: '#ef5350',
        dark: '#d32f2f',
      },
      info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 24px',
          },
          contained: {
            boxShadow: '0 4px 12px rgba(0, 137, 123, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 137, 123, 0.4)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#00897b',
            boxShadow: '0 2px 8px rgba(0,137,123,0.25)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
    transitions: {
      duration: {
        standard: 300,
      },
    },
  });

  const value = {
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
