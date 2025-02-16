interface Window {
  ethereum: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: Array<any> }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    removeAllListeners: (eventName: string) => void;
    isConnected: () => boolean;
    chainId: string;
    networkVersion: string;
    selectedAddress: string | null;
  };
}

interface EthereumEvent {
  connect: { chainId: string };
  disconnect: { code: number; message: string };
  accountsChanged: string[];
  chainChanged: string;
  message: { type: string; data: unknown };
}

type EthereumEventKeys = keyof EthereumEvent;
type EthereumEventHandler<K extends EthereumEventKeys> = (event: EthereumEvent[K]) => void;

interface Ethereum {
  on<K extends EthereumEventKeys>(event: K, handler: EthereumEventHandler<K>): void;
  removeListener<K extends EthereumEventKeys>(event: K, handler: EthereumEventHandler<K>): void;
  removeAllListeners(event: EthereumEventKeys): void;
}