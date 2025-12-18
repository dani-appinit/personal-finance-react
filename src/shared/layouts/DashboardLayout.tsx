import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Stack,
} from '@mui/material';
import { AccountBalance, Logout } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { useLogoutMutation } from '../../features/auth/hooks/useAuth';
import { SettingsMenu } from '../components/settings/SettingsMenu';
import { useTranslate } from '../i18n/useTranslate';

export const DashboardLayout: React.FC = () => {

  const user = useAppSelector((state) => state.auth.user);
  const translate = useTranslate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
 
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
            <AccountBalance />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {translate('auth.title')}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight="medium">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                {user?.email}
              </Typography>
            </Box>
            <SettingsMenu />
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{ textTransform: 'none' }}
            >
              {translate('dashboard.logout')}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
