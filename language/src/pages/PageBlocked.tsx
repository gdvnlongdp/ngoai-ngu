import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
// routes
import { PATH_AUTH } from '../routes/paths';
// hooks
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ComingSoonIllustration } from '../assets';

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

export default function PageBlocked() {
  const { logout } = useAuth();
  const { translate } = useLocales();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Your Account Is Banned">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              {translate('title_banned')}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <ComingSoonIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>

          <Button size="large" variant="contained" onClick={handleLogout}>
            {translate('go_to_home')}
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
