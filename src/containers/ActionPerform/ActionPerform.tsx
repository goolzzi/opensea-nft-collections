import * as React from 'react';
import { ethers } from 'ethers';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  FormControl,
  OutlinedInput,
  Paper,
  Stack,
  MenuItem,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { styled, css } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ActionHeader from '../../components/ActionHeader';
import { alpha } from '@mui/system';
import SearchInput from '../../components/SearchInput';
import { useWatchData } from '../../libs/hooks/WatchData';
import { useApi } from '../../libs/hooks/api';
import { useEthProvider } from '../../libs/hooks/useEthProvider';
import { ERC20_TOKENS, ERC20_CONTRACT_ABI } from '../../config';
import { InputSelect } from './ActionPerform.styles';

const Image = styled('img')<{ size?: number; isActive: boolean }>`
  width: ${(props) => props.size || 50}px;
  height: ${(props) => props.size || 50}px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  cursor: pointer;

  ${(props) =>
    props.isActive &&
    css`
      outline: 2px auto #219653;
    `}
`;

const ACTION_LIST = [
  {
    id: 'telegram',
    name: 'Telegram'
  },
  {
    id: 'email',
    name: 'Email'
  },
  {
    id: 'keeper',
    name: 'Keeper'
  },
  {
    id: 'whatsapp',
    name: 'Whatsapp'
  },
  {
    id: 'metamask',
    name: 'Metamask'
  },
  {
    id: 'sms',
    name: 'SMS'
  }
];

enum ActionApps {
  Telegram = 'telegram',
  Email = 'email',
  Whatsapp = 'whatsapp',
  SMS = 'sms',
  Metamask = 'metamask',
  Keeper = 'email'
}

const ActionPerform = () => {
  const [activeActions, setActiveActions] = React.useState<string[]>([]);
  const { notify, threshold, updateNotify } = useWatchData();
  const api = useApi();
  const { account, signer } = useEthProvider();
  const [searchInput, setSearchInput] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [notifyAppData, setNotifyAppData] = React.useState(notify);
  const [gasFee, setGasFee] = React.useState('');
  const [repayLoanAmount, setRepayLoanAmount] = React.useState('');
  const [loanToken, setLoanToken] = React.useState('USDT');

  React.useEffect(() => {
    setActiveActions(Object.keys(notify).map((app) => ActionApps[app as keyof typeof ActionApps]));
    setNotifyAppData(notify);
  }, [notify]);

  const handleClickAction = (actionName: string) => {
    const idx = activeActions.indexOf(actionName);

    if (idx === -1) {
      setActiveActions([...activeActions, actionName]);
      if (actionName === 'telegram' && !notify.Telegram) {
        const uuid = uuidv4();
        setNotifyAppData({ ...notifyAppData, Telegram: uuid });
      }
    } else {
      setActiveActions((prev) => {
        prev.splice(idx, 1);

        return [...prev];
      });
    }
  };

  const handleClickComplete = async () => {
    setSubmitting(true);
    const payload = {
      threshold: +threshold,
      notify: notifyAppData
    };
    await api.post<any>(`/aave/watch/${account}`, payload);
    updateNotify(notifyAppData);
    setSubmitting(false);
    toast.success('Alert created!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  };

  const handleClickTelegram = async () => {
    window.open(
      `https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3DJiritsu_bot%26start%3D${notifyAppData.Telegram}`
    );
  };

  const handleSendGasFee = () => {
    api.get<{ address: string; network_id: string }>('/aave/address').then((res) => {
      const { address } = res.data;
      if (account && signer && address) {
        signer.sendTransaction({
          to: address,
          value: ethers.utils.parseEther(gasFee)
        });
      }
    });
  };

  const handleAuthorize = async () => {
    // api.get<{ address: string; network_id: string }>('/aave/address').then(async (res) => {
    //   const { address } = res.data;
    const res = await api.get<{ address: string; network_id: string }>('/aave/address');
    const { address } = res.data;
    // const address =  '0xb47832132eE80e19f49E4ae354E6DebD016Bd003';
    if (account && signer && address) {
      const contract = new ethers.Contract(
        ERC20_TOKENS[loanToken as keyof typeof ERC20_TOKENS].contract_address,
        ERC20_CONTRACT_ABI,
        signer
      );

      setNotifyAppData({ ...notifyAppData, Keeper: {
        token: ERC20_TOKENS[loanToken as keyof typeof ERC20_TOKENS].contract_address,
        amount: +repayLoanAmount,
        interestMode: 2,
        wallet_address: account
      }})

      await contract.approve(address, ethers.utils.parseUnits(repayLoanAmount).toHexString());
    }
  };

  const checkInvalidateFields = () => {
    return (
      (activeActions.includes('email') && !notifyAppData.Email) ||
      (activeActions.includes('Keeper') &&
        (!notifyAppData.Keeper?.token || !notifyAppData.Keeper.amount))
    );
  };

  return (
    <>
      <Paper sx={{ padding: 0.375, borderRadius: 2, width: { xs: '100%', md: 500 } }} elevation={4}>
        <ActionHeader
          name="Action"
          title="Perform an action:"
          step="3"
          icon={<EmailOutlinedIcon htmlColor="#fff" />}
        />
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                fontSize={11}
                color="common.black"
                lineHeight="35px"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                STEP 1
              </Typography>

              <Typography fontSize={12} color="secondary.main">
                Choose one or more applications to receive alerts from
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" sx={{ mb: 3, gap: 1.25, flexWrap: 'wrap' }}>
              {ACTION_LIST.filter(
                (action) => action.id.includes(searchInput) || activeActions.includes(action.id)
              ).map((action) => (
                <Image
                  key={action.id}
                  src={`/assets/images/apps/${action.id}.png`}
                  onClick={() => handleClickAction(action.id)}
                  isActive={activeActions.includes(action.id)}
                />
              ))}
            </Stack>
            <SearchInput
              value={searchInput}
              onChange={(evt) => setSearchInput(evt.currentTarget.value)}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                fontSize={11}
                color="common.black"
                lineHeight="35px"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                STEP 2
              </Typography>
              <Typography fontSize={12} color="secondary.main">
                Choose an action
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Paper sx={{ position: 'relative' }} elevation={0}>
              {activeActions.includes('email') && (
                <Paper sx={{ my: 1, p: 1, display: 'flex', alignItems: 'center' }}>
                  <img
                    key="email"
                    src="/assets/images/apps/email.png"
                    style={{ paddingRight: 8 }}
                  />
                  <FormControl variant="outlined" fullWidth margin="none">
                    <OutlinedInput
                      sx={{ borderRadius: 4.5 }}
                      inputProps={{
                        sx: { py: 0.75, pl: 2, fontSize: 15 },
                        placeholder: 'Email address',
                        type: 'email'
                      }}
                      value={notify.Email}
                      onChange={(evt) =>
                        setNotifyAppData({ ...notifyAppData, Email: evt.currentTarget.value })
                      }
                    />
                  </FormControl>
                </Paper>
              )}

              {activeActions.includes('telegram') && (
                <Paper sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <img
                    key="telegram"
                    src="/assets/images/apps/telegram.png"
                    style={{ paddingRight: 8 }}
                  />
                  <Button fullWidth variant="contained" onClick={handleClickTelegram}>
                    Connect Telegram
                  </Button>
                </Paper>
              )}

              {activeActions.includes('keeper') && (
                <Paper sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <img
                    key="telegram"
                    src="/assets/images/apps/keeper.png"
                    style={{ paddingRight: 8 }}
                  />
                  <Stack spacing={1} flex={1} position="relative">
                    <FormControl
                      variant="outlined"
                      fullWidth
                      margin="none"
                      sx={{ position: 'relative' }}
                    >
                      <OutlinedInput
                        sx={{ borderRadius: 4.5 }}
                        inputProps={{
                          sx: { py: 0.75, pl: 2, pr: 16, fontSize: 15 },
                          placeholder: 'Gas Payment',
                          step: 0.01
                        }}
                        type="number"
                        value={gasFee}
                        onChange={(evt) => setGasFee(evt.target.value)}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          position: 'absolute',
                          right: 4,
                          height: 'calc(100% - 6px)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          borderRadius: 4.5
                        }}
                        disabled={!gasFee}
                        disableElevation
                        onClick={handleSendGasFee}
                      >
                        Pay Gas Now
                      </Button>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      margin="none"
                      sx={{ position: 'relative' }}
                    >
                      <OutlinedInput
                        sx={{ borderRadius: 4.5, pr: 0.5 }}
                        inputProps={{
                          sx: { py: 0.75, pl: 2, fontSize: 15 },
                          placeholder: 'Loan Amount',
                          step: 0.01
                        }}
                        type="number"
                        value={repayLoanAmount}
                        onChange={(evt) => setRepayLoanAmount(evt.target.value)}
                        endAdornment={
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: 4.5,
                              whiteSpace: 'nowrap',
                              px: 2,
                              py: 0,
                              height: 'calc(100% - 6px)',
                              minWidth: 'auto'
                            }}
                            disabled={!repayLoanAmount}
                            disableElevation
                            onClick={handleAuthorize}
                          >
                            Authorize
                          </Button>
                        }
                        startAdornment={
                          <InputSelect
                            value={loanToken}
                            onChange={(evt) => setLoanToken(evt.target.value as string)}
                          >
                            {Object.keys(ERC20_TOKENS).map((token, idx) => (
                              <MenuItem value={token} key={idx}>
                                {token}
                              </MenuItem>
                            ))}
                          </InputSelect>
                        }
                      />
                    </FormControl>
                  </Stack>
                </Paper>
              )}

              {!!activeActions.length && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={checkInvalidateFields() || submitting || !account}
                  fullWidth
                  sx={{ ':disabled': { backgroundColor: alpha('#219653', 0.5) }, mt: 1.5 }}
                  onClick={handleClickComplete}
                >
                  {Object.keys(notify).length > 0 ? 'Update' : 'Create'} Alerts
                </Button>
              )}
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </>
  );
};

export default ActionPerform;
