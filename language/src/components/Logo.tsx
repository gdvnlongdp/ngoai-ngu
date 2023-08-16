import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, BoxProps, Avatar } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ disabledLink = false, sx }: Props) {
  // OR
  // const logo = '/logo/logo_single.svg';

  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <Avatar
        variant="square"
        alt="GD Việt Nam"
        src="/logo/logo.png"
        sx={{ width: 69, height: 40 }}
      />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
