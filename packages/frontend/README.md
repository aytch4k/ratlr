# RATLR Frontend

The frontend application for RATLR, an AI-powered token deployment and analytics platform.

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- MQTT for real-time updates
- Ethers.js for blockchain interaction
- Chart.js for data visualization

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts

## Environment Variables

See `.env.example` for all available configuration options. Key variables include:

- `VITE_APP_ENVIRONMENT` - Application environment (development/staging/production)
- `VITE_API_URL` - Backend API URL
- `VITE_MQTT_URL` - MQTT broker WebSocket URL
- `VITE_CHAIN_ID` - Blockchain network ID
- `VITE_RPC_URL` - Blockchain RPC endpoint

## Features

- Wallet Connection
  - MetaMask integration
  - Network switching
  - Transaction signing

- Token Management
  - Deploy new tokens
  - View token details
  - Track token performance

- Real-time Updates
  - Price updates
  - Transaction notifications
  - Market alerts

- Analytics Dashboard
  - Price charts
  - Volume tracking
  - Market trends

## Docker Support

Build the container:
```bash
docker build -t ratlr-frontend .
```

Run the container:
```bash
docker run -p 3000:3000 ratlr-frontend
```

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and test:
```bash
npm run lint
npm run build
```

3. Submit pull request

## Code Style

- Follow ESLint configuration
- Use TypeScript strict mode
- Follow React best practices
- Use functional components
- Implement proper error handling
- Write meaningful comments
- Include type definitions

## Testing

- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress (coming soon)

## Performance Considerations

- Lazy loading for routes
- Code splitting
- Memoization where appropriate
- Efficient re-rendering
- Asset optimization
- Caching strategies

## Security

- Input validation
- XSS prevention
- CORS configuration
- Content Security Policy
- Secure authentication
- Protected routes

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Known Issues

See the [Issues](https://github.com/your-repo/issues) page for current limitations and bugs.

## License

Private - All rights reserved