// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Container, Typography } from '@mui/material';
// hooks
import useLocales from '../../hooks/useLocales';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// components
import Page from '../../components/Page';
// sections
import { NewPasswordForm } from '../../sections/auth/new-password';
// assets
import { SentIcon } from '../../assets';
// utils
import axios from '../../utils/axios';

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

export default function NewPassword() {
  const { translate } = useLocales();
  const usernameRecovery = sessionStorage.getItem('username-recovery') || '';

  const handleResend = async (username: string) => {
    await axios.post('/api/auth/password/generate', { username });
  };

  return (
    <Page title="New Password">
      <LogoOnlyLayout />

      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          <SentIcon sx={{ mb: 5, mx: 'auto', height: 120 }} />

          <Typography variant="h3" gutterBottom>
            {translate('new_password_title')}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            {translate('description_new_password_01')}
            <br />
            {translate('description_new_password_02')}
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <NewPasswordForm />
          </Box>

          <Typography variant="body2">
            {translate('dont_have_a_code')} &nbsp;
            <Link variant="subtitle2" onClick={() => handleResend(usernameRecovery)}>
              {translate('resend_code')}
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </Page>
  );
}
