# RATLR

RATLR is an AI-powered token deployment and analytics platform that enables users to deploy various token standards (ERC-20, ERC-721, ERC-1155) through messaging platforms while providing advanced analytics and risk assessment.

## Project Structure

```
packages/
  ├── core/          # Shared utilities, types, and AI services
  ├── bots/          # Discord and Telegram bot implementations
  ├── contracts/     # Smart contract development
  └── frontend/      # React dashboard application
```

## Prerequisites

- Docker >= 20.10.0
- Docker Compose >= 2.0.0
- Git

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd RATLR
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development environment:
```bash
docker-compose up -d
```

## Services

### Frontend (React Dashboard)
- URL: http://localhost:3000
- Development server with hot reload
- Connects to blockchain and MQTT services

### Discord & Telegram Bots
- Automated token deployment through chat commands
- Real-time notifications and alerts
- Market analytics and insights

### Smart Contracts
- Hardhat development network: http://localhost:8545
- Automated deployment and verification
- Comprehensive testing suite

### MQTT Message Broker
- Default port: 1883
- WebSocket port: 9001
- Persistent message storage

### IPFS Node
- API port: 5001
- Gateway: http://localhost:8080
- Distributed storage for token data

### AI Service
- TensorFlow Serving: http://localhost:8501
- Real-time market analysis
- Risk assessment and fraud detection

## Development

### Starting Individual Services
```bash
# Start specific services
docker-compose up frontend
docker-compose up discord_bot telegram_bot
docker-compose up contracts

# View logs
docker-compose logs -f [service_name]
```

### Running Tests
```bash
# Run all tests
docker-compose run --rm contracts npm test
docker-compose run --rm bots npm test
docker-compose run --rm frontend npm test

# Run specific test suite
docker-compose run --rm [service] npm test [test-name]
```

### Building for Production
```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Push images (if using container registry)
docker-compose -f docker-compose.prod.yml push
```

## Deployment

1. Configure production environment:
```bash
cp .env.example .env.prod
# Edit .env.prod with production values
```

2. Deploy using Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

- Prometheus metrics: http://localhost:9090
- Grafana dashboards: http://localhost:3001
- Service health checks available for all containers

## Common Tasks

### Adding Dependencies
```bash
# Add a package to a service
docker-compose run --rm [service] npm install [package]

# Update package.json and rebuild
docker-compose build [service]
```

### Database Operations
```bash
# Access SQLite database
docker-compose exec sqlite sqlite3 /data/ratlr.db

# Backup database
docker-compose exec sqlite sqlite3 /data/ratlr.db ".backup '/data/backup.db'"
```

### MQTT Operations
```bash
# View MQTT logs
docker-compose logs -f mqtt

# Test MQTT connection
docker-compose exec mqtt mosquitto_sub -t "test"
```

## Troubleshooting

### Common Issues
1. Container startup failures
   - Check logs: `docker-compose logs [service]`
   - Verify environment variables
   - Ensure required ports are available

2. Network connectivity
   - Verify network creation: `docker network ls`
   - Check container connectivity: `docker network inspect ratlr_network`

3. Data persistence
   - Check volume mounts: `docker volume ls`
   - Verify permissions on host directories

### Debug Mode
```bash
# Start services with debug output
docker-compose --verbose up

# Access container shell
docker-compose exec [service] sh
```

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and test:
```bash
docker-compose up -d
docker-compose run --rm [service] npm test
```

3. Submit pull request:
```bash
git push origin feature/your-feature-name
```

## License

Private - All rights reserved

## Support

For support, please contact the development team.