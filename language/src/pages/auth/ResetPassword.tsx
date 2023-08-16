import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// hooks
import useLocales from '../../hooks/useLocales';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const { translate } = useLocales();
  return (
    <Page title="Reset Password">
      <LogoOnlyLayout />

      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            {translate('forgot_password')}
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            {translate('please_enter_username_to_reset_password')}
          </Typography>

          <ResetPasswordForm />

          <Button
            fullWidth
            size="large"
            component={RouterLink}
            to={PATH_AUTH.login}
            sx={{ mt: 1.5 }}
          >
            {translate('back')}
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
