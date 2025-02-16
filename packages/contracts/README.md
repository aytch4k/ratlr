# RATLR Smart Contracts

This package contains the smart contracts for the RATLR platform, including token templates and factory contracts.

## Contracts

- `RATLRToken20`: ERC-20 token template with fee mechanism
- `RATLRToken721`: ERC-721 NFT template with royalties
- `RATLRToken1155`: ERC-1155 multi-token template
- `RATLRFactory`: Factory contract for deploying new tokens

## Development

### Prerequisites

- Node.js 18+
- Access to Autheo testnet
- Testnet tokens from Autheo faucet

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp ../../.env .env
   ```

2. Add your deployment private key to the `.env` file:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests on Autheo Testnet

```bash
npm test
```

### Deploy to Autheo Testnet

```bash
npm run deploy
```

## Network Configuration

The contracts are configured to work with the Autheo testnet:

- RPC URL: https://testnet-rpc1.autheo.com
- Chain ID: 785
- Explorer: https://testnet-explorer.autheo.com
- Faucet: https://testnet-faucet.autheo.com

## Contract Verification

Contracts are automatically verified on the Autheo Explorer after deployment. The verification process uses the Autheo Explorer API.

## Token Deployment Fees

- Default deployment fee: 0.1 ETH
- Platform fee: 2.5% (250 basis points)

These values can be configured in the `.env` file:
```
DEPLOYMENT_FEE=0.1
FEE_PERCENTAGE=250
```

## Contract Addresses

After deployment, contract addresses are saved in `deployment.json`. You can find the latest deployed addresses there.

## Security

- All contracts inherit from OpenZeppelin's secure contract implementations
- Includes reentrancy protection
- Pausable functionality for emergency situations
- Access control for administrative functions
- Fee mechanisms with configurable collectors

## Testing

The test suite includes:
- Deployment tests
- Token functionality tests
- Fee collection tests
- Access control tests
- Event emission tests

All tests are configured to run on the Autheo testnet to ensure compatibility.

## License

MIT