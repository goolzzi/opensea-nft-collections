import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddIcon from '@mui/icons-material/Add';
import ActionHeader from '../../components/ActionHeader';
import WalletLogin from './WalletLogin';
import AccountSelector from './AccountSelector';
import AccountDetail from './AccountDetail';
import { useEthProvider } from '../../libs/hooks/useEthProvider';
import { styled } from '@mui/system';

const Image = styled('img')({
  width: 25,
  height: 25,
  padding: 3,
  borderRadius: 5,
  border: '2px solid rgba(0, 0, 0, 0.1)'
});

const AccountConnector = () => {
  const { account } = useEthProvider();
  return (
    <>
      <Paper sx={{ padding: 0.375, borderRadius: 2, width: { xs: '100%', md: 500 } }} elevation={4}>
        <ActionHeader
          name="Account"
          title="Add Blockchain Account:"
          step="1"
          icon={<CreditCardIcon htmlColor="#fff" />}
        />
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography fontSize={11} color="common.black" lineHeight="35px" fontWeight="bold">
                STEP 1
              </Typography>
              {account ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Image src={`/assets/images/wallets/metamask.png`} />
                  <Typography
                    variant="body1"
                    fontSize={12}
                    color="secondary.main"
                    fontWeight="bold"
                  >
                    Metamask
                  </Typography>
                </Stack>
              ) : (
                <Typography fontSize={12} color="secondary.main" lineHeight="35px">
                  Choose a wallet
                </Typography>
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <WalletLogin />
          </AccordionDetails>
        </Accordion>
        {/* Choose a Loan Service */}
        {/* <Accordion disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography fontSize={11} color="common.black" lineHeight="35px" fontWeight="bold">
                STEP 2
              </Typography>
              <Typography fontSize={12} color="secondary.main" lineHeight="35px">
                Choose a Loan Service
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <AccountSelector />
          </AccordionDetails>
        </Accordion> */}
        <Accordion disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography fontSize={11} color="common.black" lineHeight="35px" fontWeight="bold">
                STEP 2
              </Typography>
              <Typography fontSize={12} color="secondary.main" lineHeight="35px">
                Account Details
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <AccountDetail />
          </AccordionDetails>
        </Accordion>
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

export default AccountConnector;
