import { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { useEthProvider } from './useEthProvider';

export interface KeeperValues {
  token: string;
  amount: number;
  interestMode: number;
  wallet_address: string;
}

interface NotifyInfo {
  Email?: string;
  Text?: string;
  Telegram?: string;
  Keeper?: KeeperValues
}

interface WatchContextValue {
  threshold: string;
  notify: NotifyInfo;
  setThreshold: (val: string) => void;
  setNotifyApp: (name: keyof NotifyInfo, value: string | KeeperValues) => void;
  updateNotify: (notify: NotifyInfo) => void;
}

const WatchContext = createContext<WatchContextValue>({} as WatchContextValue);

export const WatchProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { account } = useEthProvider();
  const [threshold, setThreshold] = useState('1.0');
  const [notify, setNotify] = useState<NotifyInfo>({});

  useEffect(() => {
    if (!account) {
      setNotify({});
    }
  }, [account])

  const setNotifyApp = (name: keyof NotifyInfo, value: string | KeeperValues) => {
    setNotify((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const updateNotify = (notify: NotifyInfo) => {
    setNotify({ ...notify });
  };
  return (
    <WatchContext.Provider value={{ threshold, notify, setThreshold, setNotifyApp, updateNotify }}>
      {children}
    </WatchContext.Provider>
  );
};

export const useWatchData = (): WatchContextValue => useContext(WatchContext);
