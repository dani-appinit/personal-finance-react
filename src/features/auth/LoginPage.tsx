import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { AccountBalance, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation } from './hooks/useAuth';
import { useTranslate } from '../../shared/i18n/useTranslate';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  

  const translate = useTranslate();
  const [showPassword, setShowPassword] = React.useState(false);

  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
  
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <AccountBalance sx={{ fontSize: 48, color: 'white' }} />
            </div>
            <div>
              <Typography variant="h3" fontWeight="bold" className="text-white">
                {translate('auth.appName')}
              </Typography>
              <Typography variant="subtitle1" className="text-blue-100">
                {translate('auth.appSlogan')}
              </Typography>
            </div>
          </div>
          

        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Container maxWidth="sm">
          <Card elevation={0} sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Box sx={{ mb: 4 }}>
                <div className="flex lg:hidden items-center gap-2 mb-6">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <AccountBalance sx={{ fontSize: 32, color: 'white' }} />
                  </div>
                
                </div>
                
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {translate('auth.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {translate('auth.subtitle')}
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={translate('auth.email')}
                      type="email"
                      fullWidth
                      margin="normal"
                      placeholder={translate('auth.emailPlaceholder')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={translate('auth.password')}
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      placeholder={translate('auth.password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

          

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loginMutation.isPending}
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  '&:hover': {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }
                }}
              >
                {loginMutation.isPending ? translate('auth.signingIn') : translate('auth.signIn')}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {translate('auth.demoAccess')}
                </Typography>
              </Divider>

              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'blue.50',
                  '& .MuiAlert-icon': {
                    color: 'primary.main'
                  }
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                  {translate('auth.demoCredentials')}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                  {translate('auth.demoEmail')}: demo@example.com
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {translate('auth.demoPassword')}: password123
                </Typography>
              </Alert>


            </Box>
          </CardContent>
        </Card>
      </Container>
      </div>
    </div>
  );
};
