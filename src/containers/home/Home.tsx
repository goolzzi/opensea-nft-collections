import { Stack } from '@mui/material';
import AccountConnector from '../AccoutConnector';
import AlertTrigger from '../AlertTrigger';
import ActionPerform from '../ActionPerform';

const Home = () => {
  return (
    <Stack sx={{ mb: 5, px: { xs: 1.5, md: 0 } }} alignItems="center">
      <AccountConnector />

      <AlertTrigger />

      <ActionPerform />
    </Stack>
  );
};

export default Home;
