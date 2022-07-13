import { Button, Input, Paper, Stack, Typography, FormHelperText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ActionHeader from '../../components/ActionHeader';
import { useWatchData } from '../../libs/hooks/WatchData';

const AlertTrigger = () => {
  const { threshold, setThreshold } = useWatchData();

  return (
    <>
      <Paper sx={{ padding: 0.375, borderRadius: 2, width: { xs: '100%', md: 500 } }} elevation={4}>
        <ActionHeader
          name="Trigger"
          title="Send an alert when:"
          step="2"
          icon={<InfoOutlinedIcon htmlColor="#fff" />}
        />
        <Stack sx={{ px: 2.5, py: 2 }}>
          <Typography fontSize={12}>When Health Factor falls below</Typography>
          <Input
            value={threshold}
            type="number"
            onChange={(evt) => setThreshold(evt.currentTarget.value)}
            inputProps={{ step: '0.1' }}
            error={+threshold < 1.0}
          />
          <FormHelperText error={+threshold < 1.0} sx={{visibility: +threshold < 1.0 ? 'visible' : 'hidden'}}>
            Error: This Health Factor is too low
          </FormHelperText>
          <FormHelperText error={+threshold === 1.0} sx={{visibility: +threshold === 1.0 ? 'visible' : 'hidden'}}>
            Warning: You may be liquidated before you are alerted!<br></br>Consider increasing the Health Factor
          </FormHelperText>
        </Stack>
      </Paper>
      <Button
        color="secondary"
        variant="contained"
        sx={{ minWidth: 'unset', borderRadius: '50%', p: 0, width: 20, height: 20, my: 2 }}
      >
        <AddIcon fontSize="small" sx={{ fontSize: 14 }} />
      </Button>
    </>
  );
};

export default AlertTrigger;
