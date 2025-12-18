import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Language,
  Brightness4,
  Brightness7,
  Palette,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setLanguage, setThemeMode, setThemeColor } from '../../../store/slices/preferencesSlice';
import { useTranslation } from '../../i18n/translations';

export const SettingsMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { language, themeMode, themeColor } = useAppSelector((state) => state.preferences);
  const translate = useTranslation(language);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'en' ? 'es' : 'en'));
  };

  const handleThemeModeToggle = () => {
    dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'));
  };

  const handleColorChange = (color: 'blue' | 'purple' | 'green') => {
    dispatch(setThemeColor(color));
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 250 },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {translate('settings.title')}
          </Typography>
        </Box>
        <Divider />
        
        <MenuItem onClick={handleLanguageToggle}>
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {translate('settings.language')}: {language === 'en' ? 'English' : 'Español'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={handleThemeModeToggle}>
          <ListItemIcon>
            {themeMode === 'light' ? <Brightness4 fontSize="small" /> : <Brightness7 fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {translate('settings.theme')}: {themeMode === 'light' ? translate('settings.light') : translate('settings.dark')}
          </ListItemText>
        </MenuItem>

        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {translate('settings.themeColor')}
          </Typography>
        </Box>

        <MenuItem onClick={() => handleColorChange('blue')} selected={themeColor === 'blue'}>
          <ListItemIcon>
            <Palette fontSize="small" sx={{ color: '#2563eb' }} />
          </ListItemIcon>
          <ListItemText>{translate('settings.blue')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleColorChange('purple')} selected={themeColor === 'purple'}>
          <ListItemIcon>
            <Palette fontSize="small" sx={{ color: '#9333ea' }} />
          </ListItemIcon>
          <ListItemText>{translate('settings.purple')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleColorChange('green')} selected={themeColor === 'green'}>
          <ListItemIcon>
            <Palette fontSize="small" sx={{ color: '#059669' }} />
          </ListItemIcon>
          <ListItemText>{translate('settings.green')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
