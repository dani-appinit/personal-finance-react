import { createSlice } from '@reduxjs/toolkit';

export type Language = 'en' | 'es';
export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'blue' | 'purple' | 'green';

interface PreferencesState {
  language: Language;
  themeMode: ThemeMode;
  themeColor: ThemeColor;
}

const loadPreferences = (): PreferencesState => {
  const saved = localStorage.getItem('preferences');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Si hay error, usar defaults
    }
  }
  return {
    language: 'es',
    themeMode: 'light',
    themeColor: 'blue',
  };
};

const initialState: PreferencesState = loadPreferences();

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setLanguage: (state, action: { payload: Language }) => {
      state.language = action.payload;
      localStorage.setItem('preferences', JSON.stringify(state));
    },
    setThemeMode: (state, action: { payload: ThemeMode }) => {
      state.themeMode = action.payload;
      localStorage.setItem('preferences', JSON.stringify(state));
    },
    setThemeColor: (state, action: { payload: ThemeColor }) => {
      state.themeColor = action.payload;
      localStorage.setItem('preferences', JSON.stringify(state));
    },
  },
});

export const { setLanguage, setThemeMode, setThemeColor } = preferencesSlice.actions;
export default preferencesSlice.reducer;
